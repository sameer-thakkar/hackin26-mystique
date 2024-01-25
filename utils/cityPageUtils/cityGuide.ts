import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import type { PrismicDocumentWithUID } from '@prismicio/types';
import { getAlternateLanguageDocUid, handleSettledPromiseResults } from 'utils';
import { ICommonProps, IGetLangBasedData } from 'utils/cityPageUtils/interface';
import { getUidFromRootLevel } from 'utils/cityPageUtils/utils';
import shouldIncludeDoc from 'utils/headerUtils/shouldIncludeInQueries';
import { sendLog } from 'utils/logger';
import { WHITELISTED_TAGS } from 'const/cityPage';
import {
  LANGUAGE_MAP,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';

const {
  MB_TYPE: { A1_CITY_GUIDE },
  PAGE_TYPE: { LANDING_PAGE },
} = MB_CATEGORISATION;

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

const getPrismicQuery = (
  mbCity: string,
  docType: 'microsite' | 'content_page',
  lang: string
) => {
  const prismicClient = createClient();
  const predicatesArray = [
    predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
    predicate.at(`my.${docType}.${TAGGED_MB_TYPE}`, A1_CITY_GUIDE),
    predicate.at(`my.${docType}.${TAGGED_CITY}`, mbCity),
    predicate.at(`my.${docType}.${TAGGED_PAGE_TYPE}`, LANDING_PAGE),
    predicate.any(`my.${docType}.${PRIMARY_TAG}`, WHITELISTED_TAGS),
  ];
  return prismicClient.getByType(docType, {
    pageSize: 20,
    predicates: predicatesArray,
    lang,
  });
};

export const getCityGuideData = async ({ mbCity, lang }: ICommonProps) => {
  try {
    const contentDocPromise = await getPrismicQuery(
      mbCity,
      'content_page',
      LANGUAGE_MAP.en.locale
    );
    const micrositeDocPromise = await getPrismicQuery(
      mbCity,
      'microsite',
      LANGUAGE_MAP.en.locale
    );
    const settledPromises = await Promise.allSettled([
      contentDocPromise,
      micrositeDocPromise,
    ]);

    const [
      contentDocResults,
      micrositeDocResults,
    ] = handleSettledPromiseResults(settledPromises);

    const results = [
      ...contentDocResults?.results,
      ...micrositeDocResults?.results,
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
