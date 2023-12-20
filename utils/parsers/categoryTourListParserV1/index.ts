import { captureException } from '@sentry/nextjs';
import type {
  CollectionDetails,
  CollectionVideos,
} from 'components/StaticBanner';
import { getHeadoutLanguagecode } from 'utils';
import {
  fetchCollectionList,
  fetchTourGroupsByCategory,
  fetchTourGroupsByCollection,
  fetchTourGroupV6,
  fetchTourListV6,
} from 'utils/apiUtils';
import { csvTgidToArray } from 'utils/helper';
import { appendInclusionExclusion } from 'utils/inclusionExclusionUtils';
import { sendLog } from 'utils/logger';
import {
  generateDescriptor,
  getSingleAriesTag,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import type { TCategoryTourListParserV1 } from './interface';

const categoryTourListParserV1 = async ({
  micrositeProductCardSliceWithData,
  shoulderPageTicketsCard,
  hostname,
  lang,
  cookies = {},
  localizedStrings,
}: TCategoryTourListParserV1) => {
  // TODO: handle looker product
  let tourData = [],
    currency: any;
  const { primary: slicePrimary, items: sliceItems } =
    micrositeProductCardSliceWithData || {};

  const { primary: spSlicePrimary } = shoulderPageTicketsCard ?? {};
  const {
    product_cards: productCards,
    locale_ranking: sliceLocaleRanking,
    locale_exclusions: sliceLocaleExclusions,
  } = slicePrimary || spSlicePrimary || {};
  const { sp_experience_limit: shoulderPageLimit } = spSlicePrimary || {};
  // @ts-expect-error
  const { data: productCardData } = productCards ?? {};

  const {
    collection,
    category,
    sub_category,
    city,
    limit,
    ranking: commonRanking,
    exclusions: commonExclusions,
    cta_url_suffix: commonCtaUrlSuffix,
    show_scratch_price: commonScratchPrice,
    additional_sub_category_ids: additionalSubCategoryIds,
  } = productCardData ?? {};

  const { cityCode, countryCode, country: countryName } = city || {};
  const finalRanking = csvTgidToArray(sliceLocaleRanking || commonRanking);
  const finalExclusions = csvTgidToArray(
    sliceLocaleExclusions || commonExclusions
  );
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
        language,
        ...(finalLimit && {
          limit: String(finalLimit),
        }),
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
      // eslint-disable-next-line no-console
      console.error(err);
    }
  } else if (category) {
    try {
      const categoryData = await fetchTourGroupsByCategory({
        categoryId: category,
        hostname,
        isSubCategory: false,
        city: cityCode as string,
        language,
        ...(finalLimit && {
          limit: String(finalLimit),
        }),
        cookies,
      });
      currency = categoryData?.currency;
      tourData.push(...categoryData?.pageData?.items);
      primaryCity = categoryData?.city;
    } catch (err) {
      captureException(err);
      sendLog({ err });
      // eslint-disable-next-line no-console
      console.error(err);
    }
  } else if (sub_category) {
    try {
      const subCategoryData = await fetchTourGroupsByCategory({
        categoryId: sub_category,
        hostname,
        isSubCategory: true,
        city: cityCode as string,
        language,
        ...(finalLimit && {
          limit: String(finalLimit),
        }),
        cookies,
      });

      currency = subCategoryData?.currency;
      primaryCity = subCategoryData?.city;
      tourData.push(...subCategoryData?.pageData?.items);
    } catch (err) {
      captureException(err);
      sendLog({ err });
      // eslint-disable-next-line no-console
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
        city: cityCode as string,
        language,
        ...(finalLimit && {
          limit: String(finalLimit),
        }),
        cookies,
      });

      tourData.push(...additionalSubCategoryData?.pageData?.items);
    } catch (err) {
      captureException(err);
      sendLog({ err });
      // eslint-disable-next-line no-console
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
        const tourObj = sliceItems?.find((item: any) => item.tgid === id);
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
    const finalTgids = finalTours?.map((el) => el?.id);

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
      finalTgids,
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

export default categoryTourListParserV1;
