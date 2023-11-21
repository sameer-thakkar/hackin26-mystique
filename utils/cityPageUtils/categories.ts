import Prismic from 'prismic-javascript';
import { Client } from 'config/prismic-config';
import type { PrismicDocumentWithUID } from '@prismicio/types';
import {
  getAlternateLanguageDocUid as getUidFromAltLangData,
  getHeadoutLanguagecode,
} from 'utils';
import { fetchCategory, fetchCollectionList } from 'utils/apiUtils';
import {
  ICategoryApiData,
  ICategoryEntity,
  IFinalData,
  IGetCategoriesData,
  IGetExploreSectionCategoriesData,
  IGetExploreSectionData,
  IGetExploreSectionSubCategoriesData,
  IGetPopularCategoriesData,
  IGetPopularSubCategoriesData,
  ISubCategoryEntity,
} from 'utils/cityPageUtils/interface';
import { getUidFromRootLevel } from 'utils/cityPageUtils/utils';
import { shouldIncludeinQueries as shouldIncludeDoc } from 'utils/headerUtils';
import { sendLog } from 'utils/logger';
import { CAT, EXPLORE_CATSUBCAT, SUBCAT } from 'const/cityPage';
import {
  CUSTOM_TYPES,
  MB_CATEGORISATION,
  PRISMIC_DEV_TAG,
  PRISMIC_FIELD_ID,
  SUPPORTED_LOCALE_MAP,
} from 'const/index';

const {
  MB_TYPE: {
    A1_CATEGORY,
    A2_CATEGORY,
    A1_SUB_CATEGORY,
    B1_GLOBAL,
    C1_COLLECTION,
    A1_COLLECTION,
    A2_SUB_CATEGORY,
  },
  PAGE_TYPE: { LANDING_PAGE },
} = MB_CATEGORISATION;

const { MICROSITE } = CUSTOM_TYPES;

const {
  TAGGED_CITY,
  TAGGED_CATEGORY,
  TAGGED_MB_TYPE,
  TAGGED_PAGE_TYPE,
  TAGGED_SUB_CATEGORY,
} = PRISMIC_FIELD_ID;

const getPopularCategoriesData = async ({
  categorySubcategoryMap,
  mbCity,
  lang,
}: IGetPopularCategoriesData) => {
  const { categoriesMap } = categorySubcategoryMap;
  const categoryNamesArr: string[] = [];
  const categoryNamesMap = new Map();
  categoriesMap.forEach((category) => {
    const { name } = category;
    categoryNamesArr.push(name);
    categoryNamesMap.set(name, category);
  });

  let categoriesFinalData: IFinalData[] = [];

  if (categoryNamesArr.length > 3) {
    try {
      const prismicData = await Client().query(
        [
          Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
          Prismic.Predicates.any(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, [
            A1_CATEGORY,
            A2_CATEGORY,
            B1_GLOBAL,
          ]),
          Prismic.Predicates.at(`my.${MICROSITE}.${TAGGED_CITY}`, mbCity),
          Prismic.Predicates.at(
            `my.${MICROSITE}.${TAGGED_PAGE_TYPE}`,
            LANDING_PAGE
          ),
          Prismic.Predicates.any(
            `my.${MICROSITE}.${TAGGED_CATEGORY}`,
            categoryNamesArr
          ),
        ],
        { pageSize: 30 }
      );

      const results = prismicData.results.filter(
        (item: PrismicDocumentWithUID) => {
          const { tagged_sub_category } = item.data;
          return !tagged_sub_category;
        }
      );

      if (results.length > 3) {
        const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
        const getUid = isBaselang ? getUidFromRootLevel : getUidFromAltLangData;

        results.forEach((item: PrismicDocumentWithUID) => {
          const uid = getUid({ doc: item, lang });
          if (uid && shouldIncludeDoc(item)) {
            const categoryName = item.data.tagged_category;
            const categoryHOData = categoryNamesMap.get(categoryName);
            categoriesFinalData.push({ uid, ...categoryHOData });
          }
        });
      }
    } catch (err) {
      sendLog({
        message: `getPopularCategoriesData failed. Citycode:${mbCity}, lang${lang}`,
      });
      return [];
    }
  }
  return categoriesFinalData.sort((itemA, itemB) => itemA.rank - itemB.rank);
};

const getPopularSubCategoriesData = async ({
  categorySubcategoryMap,
  categoryApiData,
  mbCity,
  lang,
}: IGetPopularSubCategoriesData) => {
  const {
    starredCategoriesAndSubCategories: starredItems = [],
  } = categoryApiData;
  const { subCategoriesMap } = categorySubcategoryMap;

  const starredSubCategoryNamesArr: string[] = [];
  const starredSubCategoryNamesMap = new Map();

  starredItems.forEach((item) => {
    const { subCategoryId, rank } = item;
    if (subCategoryId) {
      const subCategoryObj = subCategoriesMap.get(subCategoryId);
      if (subCategoryObj) {
        const { name } = subCategoryObj;
        starredSubCategoryNamesArr.push(name);
        starredSubCategoryNamesMap.set(name, {
          ...subCategoryObj,
          starredRank: rank,
        });
      }
    }
  });
  let subCategoriesFinalData: IFinalData[] = [];
  if (starredSubCategoryNamesArr.length > 2) {
    try {
      const prismicData = await Client().query(
        [
          Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
          Prismic.Predicates.any(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, [
            A1_CATEGORY,
            A2_CATEGORY,
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
            starredSubCategoryNamesArr
          ),
        ],
        { pageSize: 30 }
      );

      const results = prismicData.results.filter(
        (item: Record<string, any>) => {
          const { tagged_collection } = item.data;
          return !tagged_collection;
        }
      );

      if (results.length > 3) {
        const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
        const getUid = isBaselang ? getUidFromRootLevel : getUidFromAltLangData;
        results.forEach((item: PrismicDocumentWithUID) => {
          const uid = getUid({ doc: item, lang });
          if (uid && shouldIncludeDoc(item)) {
            const subCategoryName = item.data.tagged_sub_category;
            const subCategoryHOData = starredSubCategoryNamesMap.get(
              subCategoryName
            );
            if (subCategoryHOData) {
              // remove current subcategory data from current map to remove duplicates
              starredSubCategoryNamesMap.set(subCategoryName, undefined);
              subCategoriesFinalData.push({ uid, ...subCategoryHOData });
            }
          }
        });
      }
    } catch (err) {
      sendLog({
        message: `getPopularSubCategoriesData failed. Citycode:${mbCity}, lang${lang}`,
      });
      return [];
    }
  }
  return subCategoriesFinalData.sort(
    (itemA, itemB) => itemA.starredRank - itemB.starredRank
  );
};

const getCategorySubcategoryMap = ({
  categoryApiData,
}: {
  categoryApiData: ICategoryApiData;
}) => {
  const categoriesMap = new Map();
  const subCategoriesMap = new Map();
  const { categories } = categoryApiData;
  categories.forEach((category: ICategoryEntity) => {
    const { id: categoryId, subCategories = [] } = category;
    categoriesMap.set(categoryId, category);
    if (subCategories.length) {
      subCategories.forEach((subCategory: ISubCategoryEntity) => {
        const { id: subCategoryId } = subCategory;
        subCategoriesMap.set(subCategoryId, subCategory);
      });
    }
  });
  return { categoriesMap, subCategoriesMap };
};

const getExploreSectionCategoriesData = async ({
  selectedCatNamesArr,
  selectedCatNamesMap,
  subCategoriesMap,
  mbCity,
  lang,
}: IGetExploreSectionCategoriesData) => {
  const subCategoriesNamesMap = new Map();
  subCategoriesMap.forEach((subcat) => {
    const { name } = subcat;
    subCategoriesNamesMap.set(name, subcat);
  });

  const resultMap = new Map();

  try {
    const prismicDocs = await Client().query(
      [
        Prismic.Predicates.not(`document.tags`, [PRISMIC_DEV_TAG]),
        Prismic.Predicates.any(`my.${MICROSITE}.${TAGGED_MB_TYPE}`, [
          A1_SUB_CATEGORY,
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
      { pageSize: 100 }
    );

    const { results } = prismicDocs;
    const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
    const getUid = isBaselang ? getUidFromRootLevel : getUidFromAltLangData;

    results.forEach((item: PrismicDocumentWithUID) => {
      const uid = getUid({ doc: item, lang });
      const categoryName = item.data.tagged_category;
      const subCatName = item.data.tagged_sub_category;

      if (!categoryName || !subCatName || !uid || !shouldIncludeDoc(item))
        return;

      const subCatObj = subCategoriesNamesMap.get(subCatName);
      const categoryObj = selectedCatNamesMap.get(categoryName);
      const categoryEntity = resultMap.get(categoryName);
      if (subCatObj) {
        if (categoryEntity) {
          const { children } = categoryEntity;
          resultMap.set(categoryName, {
            ...categoryEntity,
            children: [...children, { ...subCatObj, uid }],
          });
        } else {
          resultMap.set(categoryName, {
            parentData: categoryObj,
            type: CAT,
            children: [{ ...subCatObj, uid }],
          });
        }
      }
    });
  } catch (err) {
    sendLog({
      message: `getExploreSectionCategoriesData failed. Citycode:${mbCity}, lang${lang}`,
    });
    return {};
  }

  return Object.fromEntries(resultMap);
};

const getExploreSectionSubCategoriesData = async ({
  selectedSubcatNamesArr,
  selectedSubcatNamesMap,
  mbCity,
  lang,
  cookies,
}: IGetExploreSectionSubCategoriesData) => {
  const resultMap = new Map();

  try {
    const prismicDocs = await Client().query(
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
          `my.${MICROSITE}.${TAGGED_SUB_CATEGORY}`,
          selectedSubcatNamesArr
        ),
      ],
      { pageSize: 100 }
    );

    const { results } = prismicDocs;
    const isBaselang = lang === SUPPORTED_LOCALE_MAP.en;
    const getUid = isBaselang ? getUidFromRootLevel : getUidFromAltLangData;

    const resultCollectionIds: number[] = [];
    results.forEach((item: Record<string, any>) => {
      const collectionId = parseInt(item.data.tagged_collection);
      if (collectionId) {
        resultCollectionIds.push(collectionId);
      }
    });

    const { collections: collectionDetails } = await fetchCollectionList({
      collectionIds: resultCollectionIds,
      language: getHeadoutLanguagecode(lang),
      cookies,
    });

    const collectionMap = new Map();

    collectionDetails.forEach((collection: Record<string, any>) => {
      const { id } = collection;
      collectionMap.set(id, collection);
    });

    results.forEach((item: PrismicDocumentWithUID) => {
      const uid = getUid({ doc: item, lang });
      const subCatName = item.data.tagged_sub_category;
      const collectionId = item.data.tagged_collection;
      if (collectionId && uid && shouldIncludeDoc(item)) {
        const collectionData = collectionMap.get(parseInt(collectionId));
        const subCatObj = selectedSubcatNamesMap.get(subCatName);
        const subCatEntity = resultMap.get(subCatName);
        if (subCatEntity) {
          const { children } = subCatEntity;
          resultMap.set(subCatName, {
            ...subCatEntity,
            children: [...children, { ...collectionData, uid }],
          });
        } else {
          resultMap.set(subCatName, {
            parentData: subCatObj,
            type: SUBCAT,
            children: [{ uid, ...collectionData }],
          });
        }
      }
    });
  } catch (err) {
    sendLog({
      message: `getExploreSectionSubCategoriesData failed. Citycode:${mbCity}, lang${lang}`,
    });
    return {};
  }
  return Object.fromEntries(resultMap);
};

const getExploreSectionData = async ({
  categorySubcategoryMap,
  mbCity,
  lang,
  cookies,
}: IGetExploreSectionData) => {
  const { categoriesMap, subCategoriesMap } = categorySubcategoryMap;
  const selectedCatNamesArr: string[] = [];
  const selectedCatNamesMap = new Map();
  const selectedSubcatNamesArr: string[] = [];
  const selectedSubcatNamesMap = new Map();

  EXPLORE_CATSUBCAT.forEach((item) => {
    const { id, type, rank } = item;
    if (type === CAT) {
      const categoryObj = categoriesMap.get(id);
      if (categoryObj) {
        const { name } = categoryObj;
        selectedCatNamesArr.push(name);
        selectedCatNamesMap.set(name, { ...categoryObj, cityPageRank: rank });
      }
    }
    if (type === SUBCAT) {
      const subCatObj = subCategoriesMap.get(id);
      if (subCatObj) {
        const { name } = subCatObj;
        selectedSubcatNamesArr.push(name);
        selectedSubcatNamesMap.set(name, {
          ...subCatObj,
          cityPageRank: rank,
        });
      }
    }
  });

  let categoriesData = {};
  if (selectedCatNamesArr.length) {
    categoriesData = await getExploreSectionCategoriesData({
      selectedCatNamesArr,
      selectedCatNamesMap,
      mbCity,
      lang,
      subCategoriesMap,
    });
  }

  let subCategoriesData = {};
  if (selectedSubcatNamesArr.length) {
    subCategoriesData = await getExploreSectionSubCategoriesData({
      selectedSubcatNamesArr,
      selectedSubcatNamesMap,
      mbCity,
      lang,
      cookies,
    });
  }
  return { categoriesData, subCategoriesData };
};

export const getCategoriesData = async ({
  lang,
  mbCity,
  cookies,
}: IGetCategoriesData) => {
  // 1. category api
  const categoryApiData = await fetchCategory({
    language: getHeadoutLanguagecode(lang),
    city: mbCity,
  });

  // 2. create map
  const categorySubcategoryMap = getCategorySubcategoryMap({
    categoryApiData,
  });

  // 3. get starred categories data
  let popularEntities = await getPopularSubCategoriesData({
    categorySubcategoryMap,
    categoryApiData,
    mbCity,
    lang,
  });

  if (popularEntities?.length < 3) {
    popularEntities = await getPopularCategoriesData({
      categorySubcategoryMap,
      mbCity,
      lang,
    });
  }

  // 4. get category/sub category carousel data
  const exploreSectionData = await getExploreSectionData({
    categorySubcategoryMap,
    mbCity,
    lang,
    cookies,
  });

  return { popularEntities, exploreSectionData };
};
