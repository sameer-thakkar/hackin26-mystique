import * as Sentry from '@sentry/nextjs';
import {
  generatePromiseForCategoryTours,
  generateSubcatFitleredCollectionsPromises,
} from 'utils';
import { getUniqueArrayItemsBy } from 'utils/arrayUtils';
import { sendLog } from 'utils/logger';
import {
  accumulatingCategoryDataFromCollectionItems,
  extractTgidsFromCategories,
} from 'utils/parser';
import getProductData from '../utils';

export default async function monthOnMonthPageParser({
  tourListCategory,
  hostname,
  showpages,
  lang,
  localizedStrings,
  cookies,
  MBDesign = '',
  taggedCollection,
}: any) {
  let subCategoryIds = new Set();
  let collectionIds = new Set();

  const { primary, items: slices } = tourListCategory || {};
  const city = primary?.city?.cityCode;

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
    primaryCity,
    primarySubCategoryId = null;

  let collectionPromises = generatePromiseForCategoryTours({
    arr: [...Array.from(collectionIds), taggedCollection],
    hostname,
    city,
    isCollection: true,
    lang,
    cookies,
  });

  let filteredCollectionPromises = generateSubcatFitleredCollectionsPromises({
    subcategoryIds: [...Array.from(subCategoryIds)],
    hostname,
    lang,
    cookies,
    primaryCollection: taggedCollection,
  });

  let subCategoryPromises = generatePromiseForCategoryTours({
    arr: [...Array.from(subCategoryIds)],
    hostname,
    city,
    isSubCategory: true,
    lang,
    cookies,
  });

  let collectionData = Promise.all(collectionPromises);
  let filteredCollectionData = Promise.all(filteredCollectionPromises);
  let subCategoryData = Promise.all(subCategoryPromises);

  await Promise.all([
    collectionData,
    filteredCollectionData,
    subCategoryData,
  ]).then((response) => {
    try {
      const [
        collectionData,
        filteredCollectionData,
        subCategoryData,
      ] = response;

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

      if (filteredCollectionData.length) {
        primaryCity = filteredCollectionData?.[0]?.city;
        accumulatingCategoryDataFromCollectionItems(
          filteredCollectionData,
          categoriesWithProducts,
          allTgids,
          subCategoryData
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      Sentry.captureException(err);
      sendLog({ err });
    }
  });

  const allData = categoriesWithProducts?.flat();
  const pageData = await getProductData(
    allData,
    allTgids,
    hostname,
    lang,
    showpageData,
    localizedStrings,
    MBDesign,
    primarySubCategoryId
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
