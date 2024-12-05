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
import { sendLog } from 'utils/logger';
import { getScorpioData, getSingleAriesTag } from 'utils/productUtils';
import { DEFAULT_PRISMIC_LANG } from 'const/index';
import type { TCategoryTourListParserV1 } from './interface';

const categoryTourListParserV1 = async ({
  micrositeProductCardSliceWithData,
  currentMicrositeProductCardSliceWithData,
  shoulderPageTicketsCard,
  hostname,
  lang,
  cookies = {},
  localizedStrings,
  isLookerWebhookCall = false,
  runRankingExperiment = false,
}: TCategoryTourListParserV1) => {
  let tourData = [],
    currency: any;
  const { primary: slicePrimary, items: sliceItems } =
    micrositeProductCardSliceWithData || {};
  const { items: localisedSliceItems } =
    currentMicrositeProductCardSliceWithData || {};

  const { primary: spSlicePrimary } = shoulderPageTicketsCard ?? {};
  const {
    product_cards: productCards,
    locale_ranking: sliceLocaleRanking,
    locale_exclusions: sliceLocaleExclusions,
    sub_category_filter,
    category_filter,
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
  const isSubCatFilter = sub_category_filter || category_filter;
  const finalLimit = isSubCatFilter ? 50 : shoulderPageLimit || limit || 10;

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
        runRankingExperiment,
      });

      const {
        city,
        currency: currentCurrency,
        tourGroups,
        pageData,
      } = collectionTourGroups;
      const tourGroupsData = runRankingExperiment
        ? tourGroups
        : pageData?.items;

      let filteredData = tourGroupsData;
      if (sub_category_filter) {
        filteredData = tourGroupsData?.filter(
          (el: Record<string, any>) =>
            el?.primarySubCategory?.id === sub_category_filter
        );
      } else if (category_filter && !sub_category_filter) {
        filteredData = tourGroupsData?.filter(
          (el: Record<string, any>) =>
            el?.primaryCategory?.id === category_filter
        );
      }

      primaryCity = city;
      currency = currentCurrency;
      tourData.push(...filteredData);

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
      sendLog({
        err,
        message: `[categoryTourListParserV1] - collection - ${collection}`,
      });
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
      sendLog({
        err,
        message: `[categoryTourListParserV1] - category - ${category}`,
      });
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
      sendLog({
        err,
        message: `[categoryTourListParserV1] - sub_category - ${sub_category}`,
      });
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

      //remove duplicate tgids added as a result of additional subcategories
      const tourDataMap = new Map(tourData.map((tour) => [tour.id, tour]));
      tourData = Array.from(tourDataMap.values());
    } catch (err) {
      captureException(err);
      sendLog({
        err,
        message: `[categoryTourListParserV1] - additionalSubCategoryIds - ${additionalSubCategoryIds}`,
      });
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

    const orderedTours = runRankingExperiment
      ? allTours
      : allTours?.sort((tourA, tourB) => {
          return (
            orderedTGIDRanking?.indexOf(parseInt(tourA.id)) -
            orderedTGIDRanking?.indexOf(parseInt(tourB.id))
          );
        });
    const finalTours = orderedTours?.filter(
      (tour) => !finalExclusions.includes(tour.id)
    );

    const sliceIndex = shoulderPageLimit || limit || 10;

    const repeatableObj = finalTours
      ?.slice(0, sliceIndex)
      ?.reduce((acc, tour) => {
        const { id, allTags, flowType } = tour || {};
        const tourObj = sliceItems?.find((item: any) => item.tgid === id) || {};
        const localisedTourObj =
          localisedSliceItems?.find((item: any) => item.tgid === id) || {};
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
          ...(lang !== DEFAULT_PRISMIC_LANG && {
            ...localisedTourObj,
          }),
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

    let scorpioData = {};
    if (!isLookerWebhookCall) {
      scorpioData = await getScorpioData({
        finalTours,
        currency,
        language,
        localizedStrings,
        tgidVariantData,
      });
    }
    const finalTgids = finalTours?.map((el) => el?.id);
    // @ts-ignore
    const { minPrice, bestDiscount } = scorpioData;
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
