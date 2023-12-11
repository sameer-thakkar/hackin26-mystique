/* eslint-disable no-console */
import * as Sentry from '@sentry/nextjs';
import { getUniqueArrayItemsBy } from 'utils/arrayUtils';
import { generatePromiseForCategoryTours } from 'utils/index';
import { sendLog } from 'utils/logger';
import {
  accumulatingCategoryAndItemsData,
  extractTgidsFromCategories,
} from 'utils/parser';
import type { TCategoryTourListParserV2 } from 'utils/parsers/categoryTourListParserV2/interface';
import getProductData from 'utils/parsers/utils/index';

export default async function categoryTourListParserV2({
  tourListCategory,
  hostname,
  showpages,
  categoryCarousel,
  lang,
  localizedStrings,
  cookies,
  MBDesign = '',
}: TCategoryTourListParserV2) {
  let categoryIds = new Set();
  let subCategoryIds = new Set();
  let collectionIds = new Set();

  const { primary, items: slices } = tourListCategory || {};

  const city = primary?.city?.cityCode;
  const primarySubCategoryID = primary?.primary_subcategory_id;

  collectionIds = slices.reduce(
    (
      accumulator: { add: (arg: number) => void },
      currentValue: { collection: number }
    ) => {
      currentValue.collection && accumulator.add(currentValue.collection);
      return accumulator;
    },
    new Set()
  );

  subCategoryIds = slices.reduce(
    (
      accumulator: { add: (arg: number) => void },
      currentValue: { sub_category: number }
    ) => {
      currentValue.sub_category && accumulator.add(currentValue.sub_category);
      return accumulator;
    },
    new Set()
  );
  categoryIds = slices.reduce(
    (
      accumulator: { add: (arg: number) => void },
      currentValue: { category: number }
    ) => {
      currentValue.category && accumulator.add(currentValue.category);
      return accumulator;
    },
    new Set()
  );

  if (categoryCarousel?.primary?.category_id) {
    categoryIds.add(categoryCarousel.primary?.category_id);
  }

  let showpageData: Record<number, string> = {};

  /* showpages consists of data for all the shows in LTT and Broadway */
  for (const page of showpages ?? []) {
    const {
      uid,
      data: { tgid },
    }: { uid: string; data: { tgid: number } } = page || { data: {} };
    showpageData[tgid] = uid;
  }
  let categoriesWithProducts: any = [],
    allTgids: number[][] = [],
    primaryCity;

  let collectionPromises = generatePromiseForCategoryTours({
    arr: Array.from(collectionIds),
    hostname,
    city,
    isCollection: true,
    lang,
    cookies,
    primarySubCategoryID,
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

  let collectionData = Promise.all(collectionPromises);
  let categoryData = Promise.all(categoryPromises);
  let subCategoryData = Promise.all(subCategoryPromises);

  await Promise.all([collectionData, categoryData, subCategoryData]).then(
    (response) => {
      try {
        const [collectionData, categoryData, subCategoryData] = response;

        if (collectionData.length) {
          const updatedCollectionData = collectionData?.map((c) => {
            const { collection, sections } = c || {};
            const filteredData = sections?.filter(
              (curr: { tourGroups: { items: [] } }) => {
                return curr?.tourGroups?.items?.length;
              }
            );
            let filterTgids: [][] = [];
            filteredData?.forEach(
              (section: {
                tourGroups: {
                  items: [];
                };
              }) => {
                if (section?.tourGroups?.items) {
                  filterTgids = filterTgids.concat(section.tourGroups.items);
                }
              }
            );
            return {
              collection,
              items: getUniqueArrayItemsBy(filterTgids, ['id']),
            };
          });
          if (updatedCollectionData?.length) {
            categoriesWithProducts.push(updatedCollectionData);
            const tgids: number[] | undefined = extractTgidsFromCategories(
              updatedCollectionData
            );
            if (tgids?.length) {
              allTgids.push(tgids);
            }
          }
        }

        if (categoryData.length) {
          primaryCity = categoryData?.[0]?.city;
          accumulatingCategoryAndItemsData(
            categoryData,
            categoriesWithProducts,
            allTgids
          );
        }

        if (subCategoryData.length) {
          primaryCity = subCategoryData?.[0]?.city;
          accumulatingCategoryAndItemsData(
            subCategoryData,
            categoriesWithProducts,
            allTgids
          );
        }
      } catch (err) {
        console.error(err);
        Sentry.captureException(err);
        sendLog({ err });
      }
    }
  );

  const allData = categoriesWithProducts?.flat();
  const pageData = await getProductData(
    allData,
    allTgids,
    hostname,
    lang,
    showpageData,
    localizedStrings,
    MBDesign,
    primarySubCategoryID
  );

  return {
    ...pageData,
    primaryCountry: {
      ...(primary?.city || {}),
    },
    primaryCity,
    isCategoryV2: true,
  };
}
