import Prismic from 'prismic-javascript';
import { Client } from 'config/prismic-config';
import type { PrismicDocumentWithUID } from '@prismicio/types';
import { getAlternateLanguageDocUid as getUidFromAltLangData } from 'utils';
import { IGetCatCTA, IGetSubCatCTA } from 'utils/cityPageUtils/interface';
import { getUidFromRootLevel } from 'utils/cityPageUtils/utils';
import { shouldIncludeinQueries as shouldIncludeDoc } from 'utils/headerUtils';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';

const { MICROSITE } = CUSTOM_TYPES;

const {
  MB_TYPE: {
    A1_CATEGORY,
    A2_CATEGORY,
    A1_SUB_CATEGORY,
    B1_GLOBAL,
    C1_COLLECTION,
    A2_SUB_CATEGORY,
  },
  PAGE_TYPE: { LANDING_PAGE },
} = MB_CATEGORISATION;

const {
  TAGGED_CITY,
  TAGGED_CATEGORY,
  TAGGED_MB_TYPE,
  TAGGED_PAGE_TYPE,
  TAGGED_SUB_CATEGORY,
} = PRISMIC_FIELD_ID;

export const getCategoriesCTADocs = async ({
  mbCity,
  lang,
  selectedCatNamesArr,
}: IGetCatCTA) => {
  try {
    const ctaResults: Record<string, any> = {};
    const prismicDocs = await Client().query(
      [
        Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
        Prismic.Predicates.any(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, [
          A1_CATEGORY,
          A2_CATEGORY,
          B1_GLOBAL,
          C1_COLLECTION,
        ]),
        Prismic.Predicates.at(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
        Prismic.Predicates.at(
          `my.${MICROSITE}.${TAGGED_PAGE_TYPE}`,
          LANDING_PAGE
        ),
        Prismic.Predicates.any(
          `my.${MICROSITE}.${TAGGED_CATEGORY}`,
          selectedCatNamesArr
        ),
      ],
      { pageSize: 15 }
    );

    const { results } = prismicDocs;
    const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
    const getUid = isBaselang ? getUidFromRootLevel : getUidFromAltLangData;

    results.forEach((doc: PrismicDocumentWithUID) => {
      const { tagged_sub_category, tagged_category } = doc.data;
      const uid = getUid({ doc, lang });
      if (uid && !tagged_sub_category && shouldIncludeDoc(doc)) {
        ctaResults[tagged_category] = { uid };
      }
    });
    return ctaResults;
  } catch (err) {
    sendLog({
      message: `getCategoriesCTADocs failed. Citycode:${mbCity}, lang${lang}`,
    });
    return {};
  }
};

export const getSubCatCTADocs = async ({
  mbCity,
  selectedSubcatNamesArr,
  lang,
}: IGetSubCatCTA) => {
  try {
    const ctaResults: Record<string, any> = {};
    const prismicDocs = await Client().query(
      [
        Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
        Prismic.Predicates.any(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, [
          A1_SUB_CATEGORY,
          A2_SUB_CATEGORY,
          B1_GLOBAL,
          C1_COLLECTION,
        ]),
        Prismic.Predicates.at(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
        Prismic.Predicates.at(
          `my.${MICROSITE}.${TAGGED_PAGE_TYPE}`,
          LANDING_PAGE
        ),
        Prismic.Predicates.any(
          `my.${MICROSITE}.${TAGGED_SUB_CATEGORY}`,
          selectedSubcatNamesArr
        ),
      ],
      { pageSize: 15 }
    );

    const { results } = prismicDocs;
    const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
    const getUid = isBaselang ? getUidFromRootLevel : getUidFromAltLangData;

    results.forEach((doc: PrismicDocumentWithUID) => {
      const { tagged_sub_category, tagged_collection } = doc.data;
      const uid = getUid({ doc, lang });
      if (uid && !tagged_collection && shouldIncludeDoc(doc)) {
        ctaResults[tagged_sub_category] = { uid };
      }
    });
    return ctaResults;
  } catch (err) {
    sendLog({
      message: `getSubCatCTADocs failed. Citycode:${mbCity}, lang${lang}`,
    });
    return {};
  }
};
