/* eslint-disable no-console */
import { captureException } from '@sentry/nextjs';
import {
  fetchBatchedVariants,
  fetchCollection,
  fetchTourGroupsByCategory,
  fetchTourGroupV6,
} from 'utils/apiUtils';
import { sendLog } from 'utils/logger';
import { generateDescriptor, getSingleAriesTag } from 'utils/productUtils';
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
        language: lang,
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
        language: lang,
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

type TParseVariantsData = {
  finalTgids: Array<number | string>;
  currencyCode: string;
  language: string;
  cookies?: Record<string, any>;
};

export const parseVariantsData = async ({
  finalTgids = [],
  currencyCode,
  language,
  cookies = {},
}: TParseVariantsData) => {
  const unorderedVariants = await fetchBatchedVariants({
    tgids: finalTgids,
    currency: currencyCode,
    language,
    cookies,
  });
  const variantsArr: Array<Record<string, any>> = [];
  Object.keys(unorderedVariants || {})?.forEach((el, index) =>
    variantsArr?.push({
      id: el,
      data: Object.values(unorderedVariants || {})[index],
    })
  );
  const orderedVariants = variantsArr?.sort((tourA, tourB) => {
    return (
      finalTgids?.indexOf(parseInt(tourA.id)) -
      finalTgids?.indexOf(parseInt(tourB.id))
    );
  });

  return orderedVariants;
};
