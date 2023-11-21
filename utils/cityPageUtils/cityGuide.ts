import Prismic from 'prismic-javascript';
import { Client } from 'config/prismic-config';
import type { PrismicDocumentWithUID } from '@prismicio/types';
import { getAlternateLanguageDocUid } from 'utils';
import { ICommonProps, IGetLangBasedData } from 'utils/cityPageUtils/interface';
import { getUidFromRootLevel } from 'utils/cityPageUtils/utils';
import { sendLog } from 'utils/logger';
import { WHITELISTED_TAGS } from 'const/cityPage';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';
import { shouldIncludeinQueries as shouldIncludeDoc } from '../headerUtils';

const {
  MB_TYPE: { A1_CITY_GUIDE },
  PAGE_TYPE: { LANDING_PAGE },
} = MB_CATEGORISATION;

const { CONTENT_PAGE, MICROSITE } = CUSTOM_TYPES;

const {
  TAGGED_MB_TYPE,
  TAGGED_CITY,
  TAGGED_PAGE_TYPE,
  PRIMARY_TAG,
} = PRISMIC_FIELD_ID;

const getLangBasedGuideData = ({ prismicDocs, lang }: IGetLangBasedData) => {
  const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
  const getUid = isBaselang ? getUidFromRootLevel : getAlternateLanguageDocUid;
  const cityGuideData: Array<object> = [];

  prismicDocs.forEach((currentDoc: PrismicDocumentWithUID) => {
    if (currentDoc) {
      const uid = getUid({ doc: currentDoc, lang });
      if (uid && shouldIncludeDoc(currentDoc)) {
        const { primary_tag } = currentDoc.data;
        const guideData = {
          uid,
          primaryTag: primary_tag,
        };
        cityGuideData.push(guideData);
      }
    }
  });
  return cityGuideData;
};

const getPrismicQuery = (mbCity: string, docType: string) => {
  return Client().query(
    [
      Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
      Prismic.Predicates.at(`my.${docType}.${TAGGED_MB_TYPE}`, A1_CITY_GUIDE),
      Prismic.Predicates.at(`my.${docType}.${TAGGED_CITY}`, mbCity),
      Prismic.Predicates.at(`my.${docType}.${TAGGED_PAGE_TYPE}`, LANDING_PAGE),
      Prismic.Predicates.any(`my.${docType}.${PRIMARY_TAG}`, WHITELISTED_TAGS),
    ],
    { pageSize: 20 }
  );
};

export const getCityGuideData = async ({ mbCity, lang }: ICommonProps) => {
  try {
    const contentDocPromise = await getPrismicQuery(mbCity, CONTENT_PAGE);
    const micrositeDocPromise = await getPrismicQuery(mbCity, MICROSITE);
    const [contentDocResults, micrositeDocResults]: Record<
      string,
      any
    >[] = await Promise.allSettled([contentDocPromise, micrositeDocPromise]);

    const results = [
      ...contentDocResults?.value?.results,
      ...micrositeDocResults?.value?.results,
    ];

    const result = getLangBasedGuideData({
      prismicDocs: results,
      lang,
    });

    return result;
  } catch (err) {
    sendLog({
      message: `getCityGuideData failed. Citycode:${mbCity}, lang${lang}`,
    });
    return [];
  }
};
