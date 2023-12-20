import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import type { PrismicDocumentWithUID } from '@prismicio/types';
import { getAlternateLanguageDocUid as getUidFromAltLangData } from 'utils';
import { IGetCatCTA, IGetSubCatCTA } from 'utils/cityPageUtils/interface';
import { getUidFromRootLevel } from 'utils/cityPageUtils/utils';
import shouldIncludeDoc from 'utils/headerUtils/shouldIncludeInQueries';
import { sendLog } from 'utils/logger';
import {
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
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

    const predicatesArray = [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.any(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, [
        A1_CATEGORY,
        A2_CATEGORY,
        B1_GLOBAL,
        C1_COLLECTION,
      ]),
      predicate.at(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
      predicate.at(`my.${MICROSITE}.${TAGGED_PAGE_TYPE}`, LANDING_PAGE),
      predicate.any(`my.${MICROSITE}.${TAGGED_CATEGORY}`, selectedCatNamesArr),
    ];

    const prismicClient = createClient();
    const prismicDocs = await prismicClient.getByType('microsite', {
      pageSize: 15,
      predicates: predicatesArray,
      lang,
    });
    sendLog({
      message: {
        documentType: CUSTOM_TYPES.MICROSITE,
        functionality: 'prismicDocs',
        queryingMultipleDocs: true,
        lang,
        msg: 'Prismic API call from Canary',
      },
    });

    const { results } = prismicDocs;
    const isBaselang = lang === DEFAULT_PRISMIC_LANG;
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

    const prismicClient = createClient();

    const predicatesArray = [
      predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
      predicate.any(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, [
        A1_SUB_CATEGORY,
        A2_SUB_CATEGORY,
        B1_GLOBAL,
        C1_COLLECTION,
      ]),
      predicate.at(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
      predicate.at(`my.${MICROSITE}.${TAGGED_PAGE_TYPE}`, LANDING_PAGE),
      predicate.any(
        `my.${MICROSITE}.${TAGGED_SUB_CATEGORY}`,
        selectedSubcatNamesArr
      ),
    ];

    const prismicDocs = await prismicClient.getByType('microsite', {
      lang,
      predicates: predicatesArray,
    });

    sendLog({
      message: {
        documentType: CUSTOM_TYPES.MICROSITE,
        functionality: 'prismicDocs',
        queryingMultipleDocs: true,
        lang,
        msg: 'Prismic API call from Canary',
      },
    });

    const { results } = prismicDocs;
    const isBaselang = lang === DEFAULT_PRISMIC_LANG;
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
