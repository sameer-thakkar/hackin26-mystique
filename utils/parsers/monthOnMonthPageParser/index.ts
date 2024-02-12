import * as Sentry from '@sentry/nextjs';
import type { TCityInfo } from 'components/AirportTransfers/PopulateAirportTransferProducts/interfaces';
import {
  generatePromiseForCategoryTours,
  generateSubcatFitleredCollectionsPromises,
} from 'utils';
import { sendLog } from 'utils/logger';
import {
  accumulatingCategoryAndItemsData,
  accumulatingCategoryDataFromCollectionItems,
} from 'utils/parser';
import getProductData from '../utils';
import { TMomPageParser } from './interface';

export default async function monthOnMonthPageParser({
  uid,
  tourListCategory,
  hostname,
  lang,
  localizedStrings,
  cookies,
  MBDesign = '',
  taggedCollection,
}: TMomPageParser) {
  const { primary, items: sliceItems } = tourListCategory || {};
  const city = (primary?.city as TCityInfo)?.cityCode;

  const collectionIds = new Set(
    sliceItems?.map((item) => item.collection)?.filter(Boolean)
  );

  const subCategoryIds = new Set(
    sliceItems?.map((item) => item.sub_category)?.filter(Boolean)
  );

  let categoriesWithProducts: any = [],
    allTgids: number[][] = [],
    primaryCity,
    currencyObject: Record<string, string | number | null> = {};

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

  await Promise.all([collectionData, filteredCollectionData, subCategoryData])
    .then((response) => {
      try {
        const [collectionData, filteredCollectionData, subCategoryData] =
          response;

        if (collectionData.length) {
          primaryCity = collectionData?.[0]?.city;
          currencyObject = collectionData?.[0]?.currency;
          accumulatingCategoryAndItemsData(
            collectionData,
            categoriesWithProducts,
            allTgids
          );
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
        sendLog({
          err,
          message: `[monthOnMonthPageParser] uid - ${uid}`,
        });
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      Sentry.captureException(err);
      sendLog({
        err,
        message: `[monthOnMonthPageParser] uid - ${uid}`,
      });
    });

  const allData = categoriesWithProducts?.flat();
  const pageData = await getProductData({
    allData,
    allTgids,
    lang,
    localizedStrings,
    MBDesign,
    currencyObject,
  });

  return {
    ...pageData,
    primaryCountry: {
      ...(primary?.city || {}),
    },
    primaryCity,
    isCategoryV2: true,
  };
}
