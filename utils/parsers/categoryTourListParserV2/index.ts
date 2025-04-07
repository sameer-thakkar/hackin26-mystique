import * as Sentry from '@sentry/nextjs';
import type { TCityInfo } from 'components/AirportTransfers/interface';
import { fetchCityInfo } from 'utils/apiUtils';
import { generatePromiseForCategoryTours } from 'utils/index';
import { sendLog } from 'utils/logger';
import { accumulatingCategoryAndItemsData, sortProducts } from 'utils/parser';
import getProductData from '../utils';
import type { TCategoryTourListParserV2 } from './interface';

export default async function categoryTourListParserV2({
  tourListCategory,
  hostname,
  categoryCarousel,
  lang,
  localizedStrings,
  cookies,
  MBDesign = '',
  isLookerWebhookCall = false,
}: TCategoryTourListParserV2) {
  const { primary, items: sliceItems } = tourListCategory || {};

  const city = (primary?.city as TCityInfo)?.cityCode;
  const primarySubCategoryID = primary?.primary_subcategory_id;

  const collectionIds = new Set(
    sliceItems.map((item) => item?.collection)?.filter(Boolean)
  );

  const categoryIds = new Set(
    sliceItems.map((item) => item?.category)?.filter(Boolean)
  );
  const subCategoryIds = new Set(
    sliceItems.map((item) => item?.sub_category)?.filter(Boolean)
  );

  if (categoryCarousel?.primary?.category_id) {
    categoryIds.add(categoryCarousel.primary?.category_id);
  }

  let categoriesWithProducts: any = [],
    allTgids: number[][] = [],
    primaryCity,
    currencyObject: Record<string, string | number | null> = {};

  let collectionPromises = generatePromiseForCategoryTours({
    arr: Array.from(collectionIds),
    hostname,
    city,
    isCollection: true,
    lang,
    cookies,
    primarySubCategoryID,
    useAutomatedRankings: true,
  });

  let categoryPromises = generatePromiseForCategoryTours({
    arr: Array.from(categoryIds),
    hostname,
    city,
    isCategory: true,
    lang,
    cookies,
  });

  let subCategoryPromises = generatePromiseForCategoryTours({
    arr: primarySubCategoryID
      ? [...Array.from(subCategoryIds), primarySubCategoryID]
      : Array.from(subCategoryIds),
    hostname,
    city,
    isSubCategory: true,
    lang,
    cookies,
    primarySubCategoryID,
  });

  const cityData = await fetchCityInfo({
    cityCode: city,
    language: lang,
    hostname,
  });

  let collectionData = Promise.all(collectionPromises);
  let categoryData = Promise.all(categoryPromises);
  let subCategoryData = Promise.all(subCategoryPromises);

  await Promise.all([
    collectionData,
    categoryData,
    subCategoryData,
    cityData,
  ]).then((response) => {
    try {
      const [collectionData, categoryData, subCategoryData, cityData] =
        response;
      if (collectionData.length) {
        primaryCity = cityData?.result?.city;
        currencyObject = collectionData?.[0]?.currency;
        accumulatingCategoryAndItemsData(
          collectionData,
          categoriesWithProducts,
          allTgids,
          true
        );
      }

      if (categoryData.length) {
        primaryCity = categoryData?.[0]?.city;
        currencyObject = categoryData?.[0]?.currency;
        accumulatingCategoryAndItemsData(
          categoryData,
          categoriesWithProducts,
          allTgids
        );
      }

      if (subCategoryData.length) {
        primaryCity = subCategoryData?.[0]?.city;
        currencyObject = categoryData?.[0]?.currency;
        accumulatingCategoryAndItemsData(
          subCategoryData,
          categoriesWithProducts,
          allTgids
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      Sentry.captureException(err);
      sendLog({ err, message: `[categoryTourListParserV2]` });
    }
  });

  const allData = sortProducts(categoriesWithProducts?.flat());

  const [firstProductData] = allData?.[0]?.items ?? [];

  let pageData;

  if (!isLookerWebhookCall) {
    pageData = await getProductData({
      allData,
      allTgids,
      lang,
      localizedStrings,
      MBDesign,
      primarySubCategoryID,
      currencyObject,
    });
    return {
      ...pageData,
      primaryCountry: {
        ...(primary?.city || {}),
      },
      primaryCity,
      isCategoryV2: true,
      firstProductData,
    };
  } else {
    return { allTgids };
  }
}
