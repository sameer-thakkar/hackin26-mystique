import Prismic from 'prismic-javascript';
import { Client } from 'config/prismic-config';
import { PrismicDocumentWithUID } from '@prismicio/types';
import { getAlternateLanguageDocUid, getHeadoutLanguagecode } from 'utils';
import { fetchCityTopCollections } from 'utils/apiUtils';
import { getUidFromRootLevel } from 'utils/cityPageUtils/utils';
import { shouldIncludeinMenu as shouldIncludeDoc } from 'utils/headerUtils';
import { sendLog } from 'utils/logger';
import {
  COOKIE,
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';
import {
  ICommonProps,
  IGetCollectionDataWithPrismicInfo,
  IGetNormalisedCollectionData,
  INearbyCollection,
} from './interface';

const {
  MB_TYPE: { A1_COLLECTION, B1_GLOBAL, C1_COLLECTION, A1_CATEGORY },
  PAGE_TYPE: { LANDING_PAGE },
  CATEGORY,
} = MB_CATEGORISATION;
const { MICROSITE } = CUSTOM_TYPES;

const {
  TAGGED_MB_TYPE,
  TAGGED_CITY,
  TAGGED_PAGE_TYPE,
  TAGGED_COLLECTION,
  TAGGED_CATEGORY,
} = PRISMIC_FIELD_ID;

const getPrismicCollectionMap = (prismicDocs = []) => {
  const collectionMap = new Map();
  const validDocs = prismicDocs.filter((doc) => shouldIncludeDoc(doc));
  validDocs.forEach((document: Record<string, any>) => {
    const collectionId = document?.data?.tagged_collection;
    if (!collectionMap.has(collectionId)) {
      collectionMap.set(collectionId, document);
    }
  });

  return collectionMap;
};

const getNormalisedCollectionData = ({
  prismicCollectionMap,
  collectionApiData,
  lang,
}: IGetNormalisedCollectionData) => {
  const results: Record<string, any> = [];
  const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
  const getUid = isBaselang ? getUidFromRootLevel : getAlternateLanguageDocUid;
  collectionApiData.forEach((item) => {
    const { id } = item;
    const prisimcDoc = prismicCollectionMap.get(`${id}`);
    if (prisimcDoc) {
      const uid = getUid({ doc: prisimcDoc, lang });
      if (uid) {
        const collectionObj = { uid, ...item };
        results.push(collectionObj);
      }
    }
  });

  return results;
};

const getCollectionDataWithPrismicInfo = async ({
  collectionApiData,
  mbCity,
  lang,
}: IGetCollectionDataWithPrismicInfo) => {
  const topCollectionsIdArr = collectionApiData.map(
    (item: Record<string, any>) => `${item.id}`
  );

  const prismicData = await Client().query(
    [
      Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
      Prismic.Predicates.any(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, [
        A1_COLLECTION,
        B1_GLOBAL,
        C1_COLLECTION,
      ]),
      Prismic.Predicates.at(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
      Prismic.Predicates.at(
        `my.${MICROSITE}.${TAGGED_PAGE_TYPE}`,
        LANDING_PAGE
      ),
      Prismic.Predicates.any(
        `my.${MICROSITE}.${TAGGED_COLLECTION}`,
        topCollectionsIdArr
      ),
    ],
    { pageSize: 60 }
  );

  const prismicCollectionMap = getPrismicCollectionMap(prismicData?.results);
  const normalisedCollectionData = getNormalisedCollectionData({
    prismicCollectionMap,
    collectionApiData,
    lang,
  });

  return normalisedCollectionData;
};

const getAllDayTripPage = async ({ mbCity, lang }: ICommonProps) => {
  try {
    const prismicData = await Client().query(
      [
        Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
        Prismic.Predicates.at(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, A1_CATEGORY),
        Prismic.Predicates.at(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
        Prismic.Predicates.at(
          `my.${MICROSITE}.${TAGGED_CATEGORY}`,
          CATEGORY.DAY_TRIPS
        ),
        Prismic.Predicates.at(
          `my.${MICROSITE}.${TAGGED_PAGE_TYPE}`,
          LANDING_PAGE
        ),
      ],
      { pageSize: 5 }
    );

    const prismicDoc = prismicData?.results?.filter(
      (item: PrismicDocumentWithUID) => !item.data.tagged_sub_category
    )[0];
    let uid = '';

    if (prismicDoc && shouldIncludeDoc(prismicDoc)) {
      const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
      const getUid = isBaselang
        ? getUidFromRootLevel
        : getAlternateLanguageDocUid;
      uid = getUid({ doc: prismicDoc, lang });
    }
    return { uid };
  } catch (err) {
    sendLog({
      message: `getAllDayTripPage failed. Citycode:${mbCity}, lang${lang}`,
    });
    return { uid: '' };
  }
};

export const getNearbyCitiesCollections = async ({
  mbCity,
  cookies,
  lang,
}: INearbyCollection) => {
  const currency = cookies[COOKIE.CURRENT_CURRENCY];
  const result = await fetchCityTopCollections({
    params: {
      city: mbCity,
      subCategoryId: 1032,
      limit: 20,
      language: getHeadoutLanguagecode(lang),
      ...(currency && { currency }),
    },
    cookies,
  });
  try {
    const collectionApiResult = result?.pageData?.items;
    const results = await getCollectionDataWithPrismicInfo({
      lang,
      mbCity,
      collectionApiData: collectionApiResult,
    });

    const allDayTripPage = await getAllDayTripPage({ mbCity, lang });

    return { nearbyTopCollections: results, allDayTripPage };
  } catch (err) {
    sendLog({
      message: `getNearbyCitiesCollections failed. Citycode:${mbCity}, lang${lang}`,
    });
    return { nearbyTopCollections: [], allDayTripPage: {} };
  }
};

export const getCityTopCollections = async ({
  mbCity,
  cookies,
  lang,
}: INearbyCollection) => {
  const currency = cookies[COOKIE.CURRENT_CURRENCY];
  const result = await fetchCityTopCollections({
    params: {
      city: mbCity,
      limit: 30,
      ...(currency && { currency }),
      language: getHeadoutLanguagecode(lang),
    },
    cookies,
  });
  try {
    const collectionApiResult = result?.pageData?.items;
    const results = await getCollectionDataWithPrismicInfo({
      lang,
      mbCity,
      collectionApiData: collectionApiResult,
    });

    return results;
  } catch (err) {
    sendLog({
      message: `getCityTopCollections failed. Citycode:${mbCity}, lang${lang}`,
    });
    return [];
  }
};
