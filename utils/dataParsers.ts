/* eslint-disable no-console */
import * as Sentry from '@sentry/nextjs';
import {
  getObject,
  parseShowPageData,
} from 'components/ShowPages/parseShowPage';
import type { CollectionDetailsTypes } from 'components/StaticBanner/index';
import {
  generatePromiseForCategoryTours,
  getHeadoutLanguagecode,
} from 'utils/index';
import {
  fetchCollection,
  fetchTourGroupsByCategory,
  fetchTourGroupV6,
  fetchTourListV6,
} from 'utils/apiUtils';
import { csvTgidToArray, getHostName, normaliseURL } from 'utils/helper';
import {
  generateDescriptor,
  getSingleAriesTag,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import { appendInclusionExclusion } from 'utils/inclusionExclusionUtils';
import { CURRENCY_SYMBOL_MAP, DESIGN } from 'const/index';
import { sendLog } from 'utils/logger';

export const uncategorizedToursListParser = (
  uncategorizedToursList: any[],
  initialVal: any[]
): any[] => {
  const initialTgids = initialVal.map((t: any) => ({
    tgid: t,
  }));
  return uncategorizedToursList.reduce(
    (accum: any, tour) => {
      const { tgid, tid } = tour;
      return [...accum, { tgid, tid, ...tour }];
    },
    [...initialTgids]
  );
};

const extractTgidsFromCategories = (arr: Record<string, any>[]) => {
  if (!arr || arr.length === 0) return [];
  if (arr.length > 0) {
    return arr
      .map(
        (data) =>
          data?.items?.map((product: Record<string, any>) => product?.id) ?? []
      )
      .flat();
  }
};

type TCategoryTourListParserV1 = {
  productCard: Record<string, any>;
  sliceObj: Record<string, any>;
  hostname: string;
  lang: string;
  cookies?: Record<string, any>;
  localizedStrings?: Record<string, any>;
};

export const categoryTourListParserV1 = async ({
  productCard,
  sliceObj,
  hostname,
  lang,
  cookies = {},
  localizedStrings,
}: TCategoryTourListParserV1) => {
  let tourData = [],
    currency: any;
  const { primary, items } = sliceObj || {};
  const {
    locale_ranking,
    locale_exclusions,
    sp_experience_limit: shoulderPageLimit,
  } = primary || {};
  const {
    collection,
    category,
    sub_category,
    city,
    limit,
    ranking,
    exclusions,
    cta_url_suffix: commonCtaUrlSuffix,
    show_scratch_price: commonScratchPrice,
  } = productCard || {};
  const { cityCode, countryCode, country: countryName } = city || {};
  const localeRanking = csvTgidToArray(locale_ranking);
  const commonRanking = csvTgidToArray(ranking);
  const localeExclusions = csvTgidToArray(locale_exclusions);
  const commonExclusions = csvTgidToArray(exclusions);
  const finalRanking = localeRanking?.length ? localeRanking : commonRanking;
  const finalExclusions = localeExclusions?.length
    ? localeExclusions
    : commonExclusions;
  const finalLimit = shoulderPageLimit || limit;

  const language = getHeadoutLanguagecode(lang);
  let primaryCity;
  let collectionVideo: string = '';
  let collectionDetails: CollectionDetailsTypes | Object = {};

  if (collection) {
    try {
      const collectionData = await fetchCollection({
        collectionId: collection,
        hostname,
        language,
        limit: finalLimit,
        cookies,
      });

      const {
        id,
        displayName,
        metaDescription,
        ratingsInfo = {},
        heroImageUrl,
        cardImageUrl,
        startingPrice,
      } = collectionData?.collection ?? {};
      const { currency: currentCurrency, listingPrice } = startingPrice ?? {};

      collectionDetails = {
        id,
        displayName,
        metaDescription,
        ratingsCount: ratingsInfo?.ratingsCount,
        averageRating: ratingsInfo?.averageRating,
        heroImageUrl,
        cardImageUrl,
        listingPrice,
        currency: currentCurrency,
      };
      primaryCity = collectionData?.city;
      collectionVideo = collectionData?.collection?.collectionVideo;
      currency = collectionData?.city?.country?.currency;
      const getCollectionSection = (
        collectionData: any,
        sectionType: string
      ) => {
        return collectionData?.sections
          ?.filter((section: any) => {
            if (section?.type === sectionType) {
              return section?.tourGroups?.items;
            }
          })
          ?.reduce((acc: any, curr: any) => curr + acc);
      };
      const pinnedCardsSection = getCollectionSection(
        collectionData,
        'PINNED_CARDS'
      );
      const genericSection = getCollectionSection(collectionData, 'GENERIC');
      const headoutPicksSection = getCollectionSection(
        collectionData,
        'HEADOUT_PICKS'
      );

      const pinnedProducts = pinnedCardsSection?.tourGroups?.items?.length
        ? pinnedCardsSection?.tourGroups?.items
        : [];
      const finalSections = genericSection?.tourGroups?.items?.length
        ? [...genericSection?.tourGroups?.items]
        : [...headoutPicksSection?.tourGroups?.items];
      const allProducts = pinnedProducts?.length
        ? finalSections?.filter((product) =>
            pinnedProducts?.some((p: any) => product?.id !== p?.id)
          )
        : finalSections;
      tourData.push(...pinnedProducts, ...allProducts);
    } catch (err) {
      Sentry.captureException(err);
      sendLog({ err });
      console.error(err);
    }
  } else if (category) {
    try {
      const categoryData = await fetchTourGroupsByCategory({
        categoryId: category,
        hostname,
        isSubCategory: false,
        city: cityCode,
        language,
        limit: finalLimit,
        cookies,
      });
      currency = categoryData?.currency;
      tourData.push(...categoryData?.pageData?.items);
      primaryCity = categoryData?.city;
    } catch (err) {
      Sentry.captureException(err);
      sendLog({ err });
      console.error(err);
    }
  } else if (sub_category) {
    try {
      const subCategoryData = await fetchTourGroupsByCategory({
        categoryId: sub_category,
        hostname,
        isSubCategory: true,
        city: cityCode,
        language,
        limit: finalLimit,
        cookies,
      });
      currency = subCategoryData?.currency;
      primaryCity = subCategoryData?.city;
      tourData.push(...subCategoryData?.pageData?.items);
    } catch (err) {
      Sentry.captureException(err);
      sendLog({ err });
      console.error(err);
    }
  }
  if (tourData?.length || finalRanking?.length) {
    let allTours = [...tourData];
    const intialTgids = tourData?.map((tour) => tour.id);
    const tgidsToFetch = finalRanking?.filter(
      (tgid: any) => !intialTgids.includes(tgid)
    );
    if (tgidsToFetch?.length) {
      const additionalTours = await fetchTourListV6({
        hostname,
        language,
        tgids: tgidsToFetch,
        cookies,
      });
      if (additionalTours?.tourGroups?.length) {
        allTours = [...tourData, ...additionalTours?.tourGroups];
      }

      if (!primaryCity && additionalTours?.cities?.length) {
        primaryCity = additionalTours.cities[0];
      }
    }
    const tgidsWithHORanking = allTours
      ?.map((tour) => tour.id)
      ?.filter((tgid) => !finalRanking?.includes(tgid));
    let orderedTGIDRanking: any;
    if (finalRanking?.length && tgidsWithHORanking?.length) {
      orderedTGIDRanking = [...finalRanking, ...tgidsWithHORanking];
    } else if (tgidsWithHORanking?.length) {
      orderedTGIDRanking = [...tgidsWithHORanking];
    } else {
      orderedTGIDRanking = [...finalRanking];
    }
    const orderedTours = allTours?.sort((tourA, tourB) => {
      return (
        orderedTGIDRanking?.indexOf(parseInt(tourA.id)) -
        orderedTGIDRanking?.indexOf(parseInt(tourB.id))
      );
    });
    const finalTours = orderedTours?.filter(
      (tour) => !finalExclusions.includes(tour.id)
    );

    const sliceIndex = finalLimit
      ? finalLimit
      : finalTours.length >= 10
      ? 10
      : finalTours.length;

    const repeatableObj = finalTours
      ?.slice(0, sliceIndex)
      ?.reduce((acc, tour) => {
        const { id, allTags, flowType } = tour || {};
        const tourObj = items?.find((item: any) => item.tgid === id);
        const [variantId] =
          getSingleAriesTag(allTags, 'DEFAULT_VARIANT')?.match(/\d+/) || [];
        const finalObj = {
          tgid: id,
          cta_url_suffix: commonCtaUrlSuffix,
          marketing_highlights_override: null,
          offer__free_tour: { link_type: 'Document' },
          product_booster: [],
          short_summary: [],
          show_scratch_price: commonScratchPrice ? 'Yes' : 'No',
          tag_booster: null,
          tid: null,
          tour_description_override: [],
          tour_title_override: null,
          variantId,
          flowType,
          ...tourObj,
        };
        return [...acc, finalObj];
      }, []);
    const allMultiVariantTgids = repeatableObj
      .filter((tour: any) => tour.variantId)
      .map((tour: any) => tour.tgid);

    const tgidVariantData: any[] = await Promise.all(
      allMultiVariantTgids?.map(async (tgid: any) =>
        fetchTourGroupV6({ tgid, hostname, language, cookies })
      )
    );

    const scorpioData = finalTours?.reduce((acc, tour) => {
      const {
        id,
        allTags,
        averageRating,
        callToAction,
        highlights,
        listingPrice,
        imageUrl,
        media,
        descriptors,
        minDuration,
        maxDuration,
        name,
        reviewCount,
        combo,
        multiVariant,
        primaryCollection,
        primaryCategory,
        primarySubCategory,
        cancellationPolicy,
        cancellationPolicyV2,
        reschedulePolicy,
        ticketValidity,
        flowType,
        allVariantOpenDated,
        inclusionsRichText,
        exclusionsRichText,
      } = tour ?? {};
      const { productImages, safetyImages } = media || {};
      const updatedDescriptors = generateDescriptor({
        descriptors,
        lang: language,
      });
      let {
        microBrandsHighlight,
      }: { microBrandsHighlight: Record<string, any>[] } = tour ?? {};
      const {
        urlSlugs: _primaryCategoryUrlSlugs,
        ...primaryCategoryWithoutSlugs
      } = primaryCategory ?? {};
      const {
        urlSlugs: _primarySubCategoryUrlSlugs,
        ...primarySubCategoryWithoutSlugs
      } = primarySubCategory ?? {};

      microBrandsHighlight = standardizeCancellationPolicy({
        highlights: microBrandsHighlight,
        cancellationPolicy: cancellationPolicyV2 ?? cancellationPolicy,
        reschedulePolicy,
        ticketValidity,
        lang: getHeadoutLanguagecode(lang),
        localizedStrings,
      });

      microBrandsHighlight = appendInclusionExclusion({
        highlightArr: microBrandsHighlight,
        inclusions: inclusionsRichText,
        exclusions: exclusionsRichText,
      });

      const { variants } =
        tgidVariantData?.find((item: any) => item.id === id) || {};
      const [variantId] =
        getSingleAriesTag(allTags, 'DEFAULT_VARIANT')?.match(/\d+/) || [];
      const { listingPrice: variantListingPrice } =
        variants?.find((variant: any) => variant?.id === Number(variantId)) ||
        {};
      const finalListingPrice = variantListingPrice
        ? variantListingPrice
        : listingPrice;
      return {
        ...acc,
        [id]: {
          allTags,
          available: !(listingPrice === null),
          averageRating,
          ctaBooster: callToAction,
          descriptors: updatedDescriptors,
          highlights: microBrandsHighlight,
          imageUrl,
          images: productImages,
          listingPrice: {
            ...finalListingPrice,
            ...currency,
          },
          productHighlights: highlights,
          productTitle: name,
          reviewCount,
          safetyImages,
          title: name,
          combo,
          multiVariant,
          minDuration,
          maxDuration,
          primaryCollection,
          primaryCategory: primaryCategoryWithoutSlugs,
          primarySubCategory: primarySubCategoryWithoutSlugs,
          flowType,
          allVariantOpenDated,
        },
      };
    }, {});

    return {
      scorpioData,
      primaryCountry: primaryCity?.country ?? {
        code: countryCode,
        countryName,
      },
      primaryCity,
      orderedTours: repeatableObj,
      activeCurrency: currency,
      collectionDetails,
      collectionVideo,
    };
  } else {
    return {
      primaryCountry: primaryCity?.country ?? {
        code: countryCode,
        countryName,
      },
      primaryCity,
      activeCurrency: currency,
    };
  }
};

type TCategoryTourListParserV2 = {
  tourListCategory: { [key: string]: any };
  hostname: string;
  showpages: any;
  categoryCarousel?: { [key: string]: any };
  lang: string;
  localizedStrings: any;
  cookies?: { [key: string]: string };
  MBDesign?: string;
};

export const categoryTourListParserV2 = async ({
  tourListCategory,
  hostname,
  showpages,
  categoryCarousel,
  lang,
  localizedStrings,
  cookies,
  MBDesign = '',
}: TCategoryTourListParserV2) => {
  const categoryIds = [],
    subCategoryIds: any = [],
    collectionIds: any = [];

  const { primary, items: slices } = tourListCategory || {};
  const city = primary?.city?.cityCode;
  if (slices?.length) {
    slices?.forEach((c: any) => {
      const { collection, category, sub_category } = c || {};
      if (collection) {
        collectionIds?.push(collection);
      }
      if (!collection && category) {
        categoryIds?.push(category);
      }
      if (!collection && !category && sub_category) {
        subCategoryIds?.push(sub_category);
      }
    });
  }
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  if (categoryCarousel.primary?.category_id) {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    categoryIds.push(categoryCarousel.primary?.category_id);
  }

  let showpageData = {},
    data;
  if (showpages?.length) {
    showpages?.forEach((page: any) => {
      const {
        uid,
        data: { tgid },
      } = page || { data: {} };
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      showpageData[tgid] = uid;
    });
  }
  let allPromises,
    categoriesWithProducts = [],
    allTgids = [],
    finalObj = {},
    primaryCity;

  if (collectionIds?.length) {
    try {
      const collectionSet = new Set(collectionIds);
      const collections = Array.from(collectionSet);
      allPromises = generatePromiseForCategoryTours({
        arr: collections,
        hostname,
        city,
        isCollection: true,
        lang,
        cookies,
      });
      const data = await Promise.all(allPromises);
      const collectionData: any = data?.map((c: any) => {
        const { collection, sections } = c || {};
        const filteredData = sections.filter((curr: any) => {
          return curr?.tourGroups?.items?.length;
        });
        let filterTgids: any = [];
        filteredData.forEach((section: any) => {
          if (section?.tourGroups?.items) {
            filterTgids = filterTgids.concat(section.tourGroups.items);
          }
        });
        return {
          collection,
          items: filterTgids,
        };
      });
      if (collectionData?.length) {
        categoriesWithProducts.push(collectionData);
        const tgids = extractTgidsFromCategories(collectionData);
        if (tgids?.length) {
          allTgids.push(tgids);
        }
      }
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      sendLog({ err });
    }
  }
  if (categoryIds?.length) {
    try {
      const categorySet = new Set(categoryIds);
      const categories = Array.from(categorySet);
      allPromises = generatePromiseForCategoryTours({
        arr: categories,
        hostname,
        city,
        isCategory: true,
        lang,
        cookies,
      });
      const data = await Promise.all(allPromises);
      primaryCity = data?.[0]?.city;
      const categoryData = data
        ?.filter((d: any) => d?.pageData?.items?.length)
        ?.map((cat: any) => {
          const { category, pageData } = cat || {};
          const { items } = pageData || {};
          return {
            category,
            items,
          };
        });
      const tgids = extractTgidsFromCategories(categoryData);
      if (categoryData?.length) {
        categoriesWithProducts.push(categoryData);
      }
      if (tgids?.length) {
        allTgids.push(tgids);
      }
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      sendLog({ err });
    }
  }
  if (subCategoryIds?.length) {
    try {
      const subCategorySet = new Set(subCategoryIds);
      const subCategories = Array.from(subCategorySet);
      allPromises = generatePromiseForCategoryTours({
        arr: subCategories,
        hostname,
        city,
        isSubCategory: true,
        lang,
        cookies,
      });
      const data = await Promise.all(allPromises);
      primaryCity = data?.[0]?.city;
      const subCategoryData = data
        ?.filter((d: any) => d?.pageData?.items?.length)
        ?.map((cat: any) => {
          const { subCategory, pageData } = cat || {};
          const { items } = pageData || {};
          return {
            subCategory,
            items,
          };
        });
      const tgids = extractTgidsFromCategories(subCategoryData);
      if (subCategoryData?.length) {
        categoriesWithProducts.push(subCategoryData);
      }
      if (tgids?.length) {
        allTgids.push(tgids);
      }
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      sendLog({ err });
    }
  }

  const allData = categoriesWithProducts?.flat();
  let currencyObject;
  if (allData?.length) {
    const tgids = allTgids?.flat();
    const tgidSet = new Set(tgids);
    const allTourGroupData = await fetchTourListV6({
      hostname: getHostName(
        hostname.includes('stage-'),
        hostname.includes('localhost'),
        normaliseURL(hostname)
      ),
      language: getHeadoutLanguagecode(lang),
      tgids: Array.from(tgidSet),
    }).then((data) => {
      let formattedData = {};
      data?.tourGroups?.forEach((tour: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        formattedData[tour?.id] = tour;
      });
      return formattedData;
    });
    currencyObject = (allTourGroupData as any)?.currencies?.[0];
    const tgidsWithShowPages = Object.keys(showpageData);
    const hasShowPageData = !!tgidsWithShowPages.length;
    allData?.forEach((c: any) => {
      const { collection, category, subCategory, items } = c || {};
      const { id: categoryId } = collection || category || subCategory || {};

      let itemsToRender = items;
      if (MBDesign !== DESIGN.V3) {
        itemsToRender = items?.filter((product: any) =>
          tgidsWithShowPages.includes(String(product.id))
        );
      }
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      finalObj[categoryId] = itemsToRender?.map((product: any) => {
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
        const { finalPrice, originalPrice, currencyCode } = listingPrice || {};
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode];
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

        const contentBlocks = {
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
            ? // @ts-expect-error TS(2345): Argument of type '{ label: any; content: string | ... Remove this comment to see the full error message
              contentBlocks?.left?.push(block)
            : // @ts-expect-error TS(2345): Argument of type '{ label: any; content: string | ... Remove this comment to see the full error message
              contentBlocks?.right?.push(block);
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          showPageUid: hasShowPageData ? showpageData[id] : null,
          listicleShowSummary,
          listicleWhyWatch,
          hasSpecialOffer,
          minDuration,
          maxDuration,
          combo,
          multiVariant,
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
};

export const tourListApiParser = (
  apiResponse: Record<string, any>,
  lang = 'en'
): Record<number, any> => {
  const currencySymbolMap = apiResponse?.currencies?.reduce(
    // @ts-expect-error TS(7006): Parameter 'acc' implicitly has an 'any' type.
    (acc, currency) => ({
      ...acc,
      [currency.code]: { ...currency },
    }),
    {}
  );
  return apiResponse?.tourGroups?.reduce(
    (acc: Record<string, any>, tour: Record<string, any>) => {
      const {
        id,
        allTags,
        descriptors,
        averageRating,
        callToAction,
        highlights,
        listingPrice,
        media,
        imageUrl,
        microBrandsHighlight,
        name,
        reviewCount,
        primaryCollection,
        primaryCategory,
        primarySubCategory,
        flowType,
      } = tour || {};
      const { productImages, safetyImages } = media || {};
      const updatedDescriptors = generateDescriptor({
        descriptors,
        lang,
      });

      return {
        ...acc,
        [id]: {
          allTags,
          available: !(listingPrice === null),
          averageRating,
          callToAction,
          ctaBooster: callToAction,
          currency: listingPrice?.currencyCode,
          descriptors: updatedDescriptors,
          highlights: microBrandsHighlight,
          image: imageUrl,
          images: productImages,
          listingPrice: {
            ...listingPrice,
            ...currencySymbolMap[listingPrice?.currencyCode],
          },
          productHighlights: highlights,
          productTitle: name,
          price: listingPrice?.finalPrice,
          reviewCount,
          safetyImages,
          scratchPrice: listingPrice?.originalPrice,
          title: name,
          tgid: id,
          primaryCollection,
          primaryCategory,
          primarySubCategory,
          flowType,
        },
      };
    },
    {}
  );
};

export const parseV2ProductDescriptors = ({
  hasCategoryTourList = false,
  descriptors,
  category,
}: {
  hasCategoryTourList: boolean;
  descriptors: any;
  category?: string;
}) => {
  let finalDescriptors;
  if (!descriptors) return [];
  if (descriptors) {
    switch (true) {
      case hasCategoryTourList:
        finalDescriptors = category ? [category, ...descriptors] : descriptors;
        break;
      case descriptors?.includes('\r\n'):
        finalDescriptors = descriptors?.split('\r\n');
        break;
      case descriptors?.includes('|'):
        finalDescriptors = descriptors?.split('|');
        break;
      case descriptors?.includes(','):
        finalDescriptors = descriptors?.split(',');
    }
    return finalDescriptors?.length
      ? finalDescriptors
          ?.filter((desc: any) => desc?.length)
          ?.map((d: any) => d?.trim())
      : [];
  }
};

type TGetToursGlobalCollection = {
  lang: string;
  collection?: number;
  sub_category?: number;
  tgid?: number;
  commonCtaUrlSuffix?: string;
  commonScratchPrice?: boolean;
  hostname?: string;
  cityName?: string;
  cookies?: { [key: string]: string };
};
type TToursGlobalCollectionObject = ReturnType<
  () => {
    scorpioData: Record<string, any>;
    orderedTours: Record<string, any>;
    primaryCity: Record<string, any>;
  }
>;

export const getToursGlobalCollection = async ({
  collection,
  sub_category,
  tgid,
  commonCtaUrlSuffix,
  commonScratchPrice,
  hostname,
  cityName,
  lang = 'en',
  cookies,
}: TGetToursGlobalCollection): Promise<TToursGlobalCollectionObject> => {
  let tourData = [],
    currency: any,
    primaryCity;

  if (collection) {
    try {
      const collectionData = await fetchCollection({
        collectionId: collection,
        hostname,
        cookies,
      });
      currency = collectionData?.city?.country?.currency;
      primaryCity = collectionData?.city;
      const getCollectionSection = (
        collectionData: any,
        sectionType: string
      ) => {
        return collectionData?.sections
          ?.filter((section: any) => {
            if (section?.type === sectionType) {
              return section?.tourGroups?.items;
            }
          })
          ?.reduce((acc: any, curr: any) => curr + acc);
      };
      const genericSection = getCollectionSection(collectionData, 'GENERIC');
      const headoutPicksSection = getCollectionSection(
        collectionData,
        'HEADOUT_PICKS'
      );
      const finalSection = genericSection?.tourGroups?.items?.length
        ? genericSection?.tourGroups?.items
        : headoutPicksSection?.tourGroups?.items;
      tourData.push(...finalSection);
    } catch (err) {
      Sentry.captureException(err);
      sendLog({ err });
      console.error(err);
    }
  } else if (sub_category) {
    try {
      const subCategoryData = await fetchTourGroupsByCategory({
        categoryId: sub_category,
        hostname,
        isSubCategory: true,
        city: cityName,
        cookies,
      });
      primaryCity = subCategoryData?.city;
      currency = subCategoryData?.currency;
      tourData.push(...subCategoryData?.pageData?.items);
    } catch (err) {
      Sentry.captureException(err);
      sendLog({ err });
      console.error(err);
    }
  } else if (tgid) {
    try {
      const tgidData = await fetchTourGroupV6({
        tgid,
        hostname,
        cookies,
      });
      currency = tgidData?.currency;
      tourData.push(tgidData);
      primaryCity = tgidData?.city;
    } catch (err) {
      Sentry.captureException(err);
      sendLog({ err });
      console.error(err);
    }
  }

  const repeatableObj = tourData?.reduce((acc, tour) => {
    const { id, allTags } = tour || {};
    const [variantId] =
      getSingleAriesTag(allTags, 'DEFAULT_VARIANT')?.match(/\d+/) || [];
    const finalObj = {
      tgid: id,
      cta_url_suffix: commonCtaUrlSuffix,
      marketing_highlights_override: null,
      offer__free_tour: { link_type: 'Document' },
      product_booster: [],
      short_summary: [],
      show_scratch_price: commonScratchPrice ? 'Yes' : 'No',
      tag_booster: null,
      tid: null,
      tour_description_override: [],
      tour_title_override: null,
      variantId,
    };
    return [...acc, finalObj];
  }, []);

  const allMultiVariantTgids = repeatableObj
    ?.filter((tour: any) => tour?.variantId)
    ?.map((tour: any) => tour.tgid);

  const tgidVariantData: any[] = await Promise.all(
    allMultiVariantTgids?.map(async (tgid: any) =>
      fetchTourGroupV6({ tgid, hostname })
    )
  );

  const scorpioData = tourData?.reduce((acc, tour) => {
    const {
      id,
      allTags,
      averageRating,
      callToAction,
      highlights,
      listingPrice,
      media,
      microBrandsHighlight,
      primaryCollection,
      primaryCategory,
      primarySubCategory,
      descriptors,
      name,
      reviewCount,
      combo,
    } = tour || {};
    const { productImages, safetyImages } = media || {};
    const updatedDescriptors = generateDescriptor({
      descriptors,
      lang,
    });
    const { variants } =
      tgidVariantData?.find((item: any) => item?.id === id) || {};
    const [variantId] =
      getSingleAriesTag(allTags, 'DEFAULT_VARIANT')?.match(/\d+/) || [];
    const { listingPrice: variantListingPrice } =
      variants?.find((variant: any) => variant?.id === Number(variantId)) || {};
    const finalListingPrice = variantListingPrice
      ? variantListingPrice
      : listingPrice;
    return {
      ...acc,
      [id]: {
        allTags,
        available: !(listingPrice === null),
        averageRating,
        ctaBooster: callToAction,
        descriptors: updatedDescriptors,
        highlights: microBrandsHighlight,
        primaryCollection,
        primaryCategory,
        primarySubCategory,
        images: productImages,
        listingPrice: {
          ...finalListingPrice,
          ...currency,
        },
        productHighlights: highlights,
        productTitle: name,
        reviewCount,
        safetyImages,
        title: name,
        combo,
      },
    };
  }, {});

  return {
    scorpioData,
    orderedTours: repeatableObj,
    primaryCity,
  };
};
