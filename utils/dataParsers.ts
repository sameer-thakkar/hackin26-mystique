/* eslint-disable no-console */
import { captureException } from '@sentry/nextjs';
import type {
  CollectionDetails,
  CollectionVideos,
} from 'components/StaticBanner/index';
import {
  fetchCollection,
  fetchCollectionList,
  fetchTourGroupsByCategory,
  fetchTourGroupsByCollection,
  fetchTourGroupV6,
  fetchTourListV6,
} from 'utils/apiUtils';
import { csvTgidToArray } from 'utils/helper';
import { appendInclusionExclusion } from 'utils/inclusionExclusionUtils';
import { getHeadoutLanguagecode } from 'utils/index';
import { sendLog } from 'utils/logger';
import {
  generateDescriptor,
  getSingleAriesTag,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import { getEncodedUrlSlugs } from 'utils/urlUtils';

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
    additional_sub_category_ids: additionalSubCategoryIds,
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
  let collectionVideos: CollectionVideos = [];
  let collectionDetails: CollectionDetails | Object = {};

  if (collection) {
    try {
      const collectionTourGroups = await fetchTourGroupsByCollection({
        collectionId: collection,
        hostname,
        city: cityCode,
        language,
        limit: finalLimit,
        cookies,
      });
      const {
        city,
        currency: currentCurrency,
        pageData,
      } = collectionTourGroups;

      primaryCity = city;
      currency = currentCurrency;
      tourData.push(...pageData?.items);

      const collectionData = await fetchCollectionList({
        collectionIds: [collection],
        hostname,
        currency: currentCurrency?.code,
        language,
        cookies,
      });

      const {
        id,
        displayName,
        metaDescription,
        ratingsInfo,
        heroImageUrl,
        cardImageUrl,
        startingPrice,
        videos,
      } = collectionData?.collections?.[0] || {};
      const { ratingsCount, averageRating } = ratingsInfo || {};

      collectionVideos = videos;
      collectionDetails = {
        id,
        displayName,
        metaDescription,
        ratingsCount,
        averageRating,
        heroImageUrl,
        cardImageUrl,
        listingPrice: startingPrice?.listingPrice,
        currency: currentCurrency?.code,
        videos,
      };
    } catch (err) {
      captureException(err);
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
      captureException(err);
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
      captureException(err);
      sendLog({ err });
      console.error(err);
    }
  }

  // Airport transfers has additional sub categories (2 sub categories)
  if (additionalSubCategoryIds) {
    try {
      const additionalSubCategoryData = await fetchTourGroupsByCategory({
        categoryId: additionalSubCategoryIds,
        hostname,
        isSubCategory: true,
        city: cityCode,
        language,
        limit: finalLimit,
        cookies,
      });

      tourData.push(...additionalSubCategoryData?.pageData?.items);
    } catch (err) {
      captureException(err);
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
    
    let minPrice = finalTours?.[0]?.listingPrice?.finalPrice || Infinity;
    let bestDiscount = finalTours?.[0]?.listingPrice?.bestDiscount || 0;

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
        ratingCount,
      } = tour ?? {};

      minPrice = Math.min(listingPrice?.finalPrice || Infinity, minPrice);
      bestDiscount = Math.max(listingPrice?.bestDiscount || 0, bestDiscount);

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

      const isMBHighlightsExist = microBrandsHighlight?.length > 0;
      const combinedHighlights = appendInclusionExclusion({
        highlightArr: microBrandsHighlight,
        inclusions: inclusionsRichText,
        exclusions: exclusionsRichText,
        localizedStrings: localizedStrings || {},
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
          highlights: combinedHighlights,
          isMBHighlightsExist,
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
          ratingCount,
        },
      };
    }, {});

    if (minPrice == Infinity) minPrice = 0;
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
      collectionVideos,
      minPrice,
      bestDiscount,
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
        urlSlugs,
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
          urlSlugs: getEncodedUrlSlugs(urlSlugs),
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
      captureException(err);
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
      captureException(err);
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
      captureException(err);
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
      urlSlugs,
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
        urlSlugs: getEncodedUrlSlugs(urlSlugs),
      },
    };
  }, {});

  return {
    scorpioData,
    orderedTours: repeatableObj,
    primaryCity,
  };
};
