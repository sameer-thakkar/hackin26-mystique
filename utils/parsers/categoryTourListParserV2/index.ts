/* eslint-disable no-console */
import * as Sentry from '@sentry/nextjs';
import {
  generatePromiseForCategoryTours,
  getHeadoutLanguagecode,
} from 'utils/index';
import { getHostName, normaliseURL } from 'utils/helper';
import { CURRENCY_SYMBOL_MAP, DESIGN } from 'const/index';
import {
  getObject,
  parseShowPageData,
} from 'components/ShowPages/parseShowPage';
import { sendLog } from 'utils/logger';
import { fetchTourListV6 } from 'utils/apiUtils';
import {
  generateDescriptor,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import {
  accumulatingCategoryAndItemsData,
  extractTgidsFromCategories,
} from 'utils/parser';
import { getEncodedUrlSlugs } from 'utils/urlUtils';

import type { TCategoryTourListParserV2, TProduct } from './interface';

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

  let showpageData: Record<number, string> = {},
    data;

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
    finalObj: Record<number, []> = {},
    primaryCity;

  let collectionPromises = generatePromiseForCategoryTours({
    arr: Array.from(collectionIds),
    hostname,
    city,
    isCollection: true,
    lang,
    cookies,
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
    arr: Array.from(subCategoryIds),
    hostname,
    city,
    isSubCategory: true,
    lang,
    cookies,
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
            const filteredData = sections.filter(
              (curr: { tourGroups: { items: [] } }) => {
                return curr?.tourGroups?.items?.length;
              }
            );
            let filterTgids: [][] = [];
            filteredData.forEach(
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
              items: filterTgids,
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
  let currencyObject;
  if (allData?.length) {
    const tgids = allTgids?.flat();
    const tgidSet = new Set(tgids);
    const allTourGroupData: any = await fetchTourListV6({
      hostname: getHostName(
        hostname.includes('stage-'),
        hostname.includes('localhost'),
        normaliseURL(hostname)
      ),
      language: getHeadoutLanguagecode(lang),
      tgids: Array.from(tgidSet),
    }).then((data) => {
      let formattedData: Record<number, any> = {};
      data?.tourGroups?.forEach((tour: { id: number }) => {
        formattedData[tour?.id] = tour;
      });
      return formattedData;
    });
    currencyObject = allTourGroupData?.currencies?.[0];
    const tgidsWithShowPages = Object.keys(showpageData);
    const hasShowPageData = !!tgidsWithShowPages.length;
    allData?.forEach((c: any) => {
      const { collection, category, subCategory, items } = c || {};
      const { id: categoryId } = collection || category || subCategory || {};

      let itemsToRender = items;
      if (MBDesign !== DESIGN.V3) {
        itemsToRender = items?.filter((product: TProduct) =>
          tgidsWithShowPages.includes(String(product.id))
        );
      }
      finalObj[categoryId] = itemsToRender?.map((product: TProduct) => {
        const {
          microBrandsDescriptor,
          descriptors: secondaryDescriptors,
          listingPrice,
          allTags,
          name,
          imageUrl,
          id,
          averageRating,
          reviewCount,
          primaryCollection,
          primaryCategory,
          primarySubCategory,
          cancellationPolicy,
          cancellationPolicyV2,
          reschedulePolicy,
          ticketValidity,
          minDuration,
          maxDuration,
          combo,
          multiVariant,
          urlSlugs,
        } = product || {};
        const { displayName: collectionName } = primaryCollection || {};
        const { displayName: primaryCategoryName } = primaryCategory || {};
        const { displayName: primarySubCategoryName } =
          primarySubCategory || {};
        const {
          urlSlugs: _primaryCategoryUrlSlugs,
          ...primaryCategoryWithoutSlugs
        } = primaryCategory ?? {};
        const {
          urlSlugs: _primarySubCategoryUrlSlugs,
          ...primarySubCategoryWithoutSlugs
        } = primarySubCategory ?? {};
        const {
          finalPrice,
          originalPrice,
          currencyCode,
        }: {
          finalPrice: number;
          originalPrice: number;
          currencyCode: string;
        } = listingPrice || {};
        const currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode as keyof {}];
        const re = /(?:\r\n|\s\|\s)/g;
        const descriptors = microBrandsDescriptor
          ? microBrandsDescriptor.split(re)
          : microBrandsDescriptor;
        const mbDescriptors = generateDescriptor({
          v2Descriptors: descriptors,
          lang: 'en',
          isEntertainmentMb: true,
        });
        let { microBrandsHighlight } = product ?? {};

        microBrandsHighlight = standardizeCancellationPolicy({
          highlights: microBrandsHighlight,
          cancellationPolicy: cancellationPolicyV2 ?? cancellationPolicy,
          reschedulePolicy,
          ticketValidity,
          showValidity: false,
          lang: getHeadoutLanguagecode(lang),
          localizedStrings,
        });

        const filterHighlights = [
          localizedStrings.SHOW_PAGE.THEATRE_NAME,
          localizedStrings.SHOW_PAGE.SHOW_TIMINGS,
          localizedStrings.SHOW_PAGE.DURATION,
          localizedStrings.SHOW_PAGE.YOUR_TICKETS,
          localizedStrings.SHOW_PAGE.CANCELLATION_POLICY,
          localizedStrings.SHOW_PAGE.AGE_LIMIT,
        ];
        const { listicleSchema, hasSpecialOffer } = parseShowPageData(
          microBrandsHighlight
        );
        let listicleShowSummary, listicleWhyWatch;

        for (let item of listicleSchema) {
          const heading = item['heading'];
          if (heading === localizedStrings.SHOW_PAGE.LISTICLE_SHOW_WHY_WATCH) {
            listicleWhyWatch = item;
          }
          if (heading === localizedStrings.SHOW_PAGE.LISTICLE_SHOW_SUMMARY) {
            listicleShowSummary = item;
          }
        }

        const { detailsObjects: highlights, isSafetyBanner: hasBestSafety } =
          getObject(microBrandsHighlight, filterHighlights) || {};
        const { detailsObjects: reopeningDate } =
          getObject(microBrandsHighlight, [
            localizedStrings.SHOW_PAGE.OPENING_DATE,
            localizedStrings.SHOW_PAGE.CLOSING_DATE,
          ]) || {};

        const contentBlocks: any = {
          hidden: [],
          left: [],
          right: [],
        };
        for (const key of filterHighlights) {
          const isLeftBlock = [
            localizedStrings.SHOW_PAGE.THEATRE_NAME,
            localizedStrings.SHOW_PAGE.SHOW_TIMINGS,
            localizedStrings.SHOW_PAGE.DURATION,
          ].includes(key);
          const value = highlights[key];
          const block = {
            label: value ? key : null,
            content: value ? value : null,
            align: isLeftBlock ? 'left' : 'right',
            len: value?.length,
            labelId: key?.toLowerCase()?.split(' ')?.join('-'),
          };
          isLeftBlock
            ? contentBlocks?.left?.push(block)
            : contentBlocks?.right?.push(block);
        }
        const { media, flowType } = allTourGroupData[id] || {};
        const { productImages } = media || {};
        const [, descriptionImage] = productImages || [];

        return {
          title: name,
          highlights: microBrandsHighlight,
          primaryCollection,
          primaryCategory: primaryCategoryWithoutSlugs,
          primarySubCategory: primarySubCategoryWithoutSlugs,
          descriptors: mbDescriptors,
          secondaryDescriptors,
          productHighlights: null,
          cardFooter: null,
          theater: null,
          content_theater: null,
          contentBlocks,
          productImage: imageUrl,
          descriptionImage:
            productImages?.length > 1 ? descriptionImage?.url : imageUrl,
          price: finalPrice,
          flowType,
          scratchPrice: originalPrice,
          currencySymbol,
          tgid: id,
          images: productImages,
          averageRating,
          reviewCount,
          ctaBooster: null,
          description: null,
          available: !!listingPrice?.finalPrice,
          overlayBooster: null,
          vendor: null,
          allTags,
          reopeningDate: reopeningDate[localizedStrings.SHOW_PAGE.OPENING_DATE],
          closingDate: reopeningDate[localizedStrings.SHOW_PAGE.CLOSING_DATE],
          hasBestSafety,
          category: {
            collectionName,
            primaryCategoryName,
            primarySubCategoryName,
          },
          microBrandsHighlight: highlights,
          listingPrice,
          safetyImages: null,
          showPageUid: hasShowPageData ? showpageData[id] : null,
          listicleShowSummary,
          listicleWhyWatch,
          hasSpecialOffer,
          minDuration,
          maxDuration,
          combo,
          multiVariant,
          urlSlugs: getEncodedUrlSlugs(urlSlugs),
        };
      });
    });
    data = { ...finalObj, activeCurrency: currencyObject };
  }
  return {
    ...data,
    primaryCountry: {
      ...(primary?.city || {}),
    },
    primaryCity,
    isCategoryV2: true,
  };
}
