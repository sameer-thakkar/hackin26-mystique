import {
  getObject,
  parseShowPageData,
} from 'components/ShowPages/parseShowPage';
import { generatePromiseForCategoryTours, getHeadoutLanguagecode } from 'utils';
import {
  fetchCollection,
  fetchTGIDsByCategoryV2,
  fetchTourGroupV6,
  fetchTourList,
} from 'utils/apiUtils';
import { csvTgidToArray } from 'utils/helper';
import {
  addCashbackValueToDescriptor,
  getSingleAriesTag,
} from 'utils/productUtils';
import { CURRENCY_SYMBOL_MAP } from 'const/index';

export const uncategorizedToursListParser = (
  uncategorizedToursList,
  initialVal
) => {
  const initialTgids = initialVal.map((t) => ({ tgid: t }));
  return uncategorizedToursList.reduce(
    (accum, tour) => {
      const { tgid, tid } = tour;
      return [...accum, { tgid, tid, ...tour }];
    },
    [...initialTgids]
  );
};

const extractTgidsFromCategories = (arr) => {
  if (arr?.length > 0) {
    return arr
      ?.map((data) => data?.items?.map((product) => product?.id))
      ?.flat();
  }
};

export const categoryTourListParserV1 = async ({
  productCard,
  sliceObj,
  hostname,
  lang,
}: {
  productCard: { [key: string]: any };
  sliceObj: { [key: string]: any };
  hostname: string;
  lang: string;
}) => {
  let tourData = [],
    currency;
  const { primary, items } = sliceObj || {};
  const { locale_ranking, locale_exclusions } = primary || {};
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
  const { cityCode } = city || {};
  const localeRanking = csvTgidToArray(locale_ranking);
  const commonRanking = csvTgidToArray(ranking);
  const localeExclusions = csvTgidToArray(locale_exclusions);
  const commonExclusions = csvTgidToArray(exclusions);
  const finalRanking = localeRanking?.length ? localeRanking : commonRanking;
  const finalExclusions = localeExclusions?.length
    ? localeExclusions
    : commonExclusions;

  const language = getHeadoutLanguagecode(lang);

  if (collection) {
    const collectionData = await fetchCollection({
      collectionId: collection,
      hostname,
      language,
      limit,
    });
    currency = collectionData?.city?.country?.currency;
    const getCollectionSection = (collectionData, sectionType: string) => {
      return collectionData?.sections
        ?.filter((section) => {
          if (section?.type === sectionType) {
            return section?.tourGroups?.items;
          }
        })
        ?.reduce((acc, curr) => curr + acc);
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
  } else if (category) {
    const categoryData = await fetchTGIDsByCategoryV2({
      categoryId: category,
      hostname,
      isSubCategory: false,
      city: cityCode,
      language,
      limit,
    });
    currency = categoryData?.currency;
    tourData.push(...categoryData?.pageData?.items);
  } else if (sub_category) {
    const subCategoryData = await fetchTGIDsByCategoryV2({
      categoryId: sub_category,
      hostname,
      isSubCategory: true,
      city: cityCode,
      language,
      limit,
    });
    currency = subCategoryData?.currency;
    tourData.push(...subCategoryData?.pageData?.items);
  }
  if (tourData?.length) {
    let allTours = [...tourData];
    const intialTgids = tourData?.map((tour) => tour.id);
    const tgidsToFetch = finalRanking?.filter(
      (tgid) => !intialTgids.includes(tgid)
    );
    if (tgidsToFetch?.length) {
      const additionalTours = await fetchTourList({
        tgids: tgidsToFetch,
        host: hostname,
        language,
      });
      const additionalToursData = await additionalTours.json();
      if (additionalToursData?.tourGroups?.length) {
        allTours = [...tourData, ...additionalToursData?.tourGroups];
      }
    }
    const tgidsWithHORanking = allTours
      ?.map((tour) => tour.id)
      ?.filter((tgid) => !finalRanking?.includes(tgid));
    let orderedTGIDRanking;
    if (finalRanking?.length && tgidsWithHORanking?.length) {
      orderedTGIDRanking = [...finalRanking, ...tgidsWithHORanking];
    } else {
      orderedTGIDRanking = [...tgidsWithHORanking];
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

    finalTours?.slice(
      0,
      limit || finalTours.length >= 10 ? 10 : finalTours.length - 1
    );

    const repeatableObj = finalTours?.reduce((acc, tour) => {
      const { id, allTags } = tour || {};
      const tourObj = items.find((item) => item.tgid === id);
      const [variantId] =
        getSingleAriesTag(allTags, 'DEFAULT_VARIANT')?.match(/\d+/) || [];

      const ctaSuffix = new URLSearchParams(commonCtaUrlSuffix || '');
      if (variantId) ctaSuffix.set('variantId', variantId);
      acc.push({
        tgid: id,
        cta_url_suffix: ctaSuffix ? `?${ctaSuffix?.toString()}` : null,
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
        ...tourObj,
      });
      return acc;
    }, []);
    const allMultiVariantTgids = repeatableObj
      .filter((tour) => tour.variantId)
      .map((tour) => tour.tgid);

    const tgidVariantData: any[] = await Promise.all(
      allMultiVariantTgids?.map(async (tgid) =>
        fetchTourGroupV6({ tgid, hostname, language })
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
        media,
        microBrandsDescriptor,
        microBrandsHighlight,
        name,
        reviewCount,
      } = tour || {};
      const { productImages, safetyImages } = media || {};
      const { cashbackValue } = listingPrice || {};
      const updatedDescriptors = addCashbackValueToDescriptor({
        descriptor: microBrandsDescriptor,
        cashbackValue,
      });
      const { variants } =
        tgidVariantData?.find((item: any) => item.id === id) || {};
      const [variantId] =
        getSingleAriesTag(allTags, 'DEFAULT_VARIANT')?.match(/\d+/) || [];
      const { listingPrice: variantListingPrice } =
        variants?.find((variant) => variant?.id === parseInt(variantId)) || {};
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
        },
      };
    }, {});

    return {
      scorpioData,
      orderedTours: repeatableObj,
    };
  }
};

interface categoryTourListParserProps {
  tourListCategory: { [key: string]: any };
  hostname: string;
  showpages: any;
  categoryCarousel?: { [key: string]: any };
}

export const categoryTourListParserV2 = async (
  obj: categoryTourListParserProps
) => {
  const categoryIds = [],
    subCategoryIds = [],
    collectionIds = [];
  const { tourListCategory, hostname, showpages, categoryCarousel } = obj || {};

  const { primary, items: slices } = tourListCategory || {};
  const city = primary?.city?.cityCode;
  if (slices?.length) {
    slices?.forEach((c) => {
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
  if (categoryCarousel.primary?.category_id) {
    categoryIds.push(categoryCarousel.primary?.category_id);
  }

  const { results: showPagesResults } = showpages || {};
  let showpageData = {},
    data;

  if (showPagesResults?.length) {
    showPagesResults?.forEach((page) => {
      const {
        uid,
        data: { tgid },
      } = page || { data: {} };
      showpageData[tgid] = uid;
    });
  }
  let allPromises,
    categoriesWithProducts = [],
    allTgids = [],
    finalObj = {};

  if (collectionIds?.length) {
    const collectionSet = new Set(collectionIds);
    const collections = Array.from(collectionSet);
    allPromises = generatePromiseForCategoryTours({
      arr: collections,
      hostname,
      city,
      isCollection: true,
    });
    const data = await Promise.all(allPromises);
    const collectionData: any = data?.map((c: any) => {
      const { collection, sections } = c || {};
      const filteredData = sections.reduce((acc, curr) => {
        if (curr?.type === 'GENERIC' && curr?.tourGroups?.items?.length) {
          return curr;
        }
      }, {});
      return {
        collection,
        items: filteredData?.tourGroups?.items,
      };
    });
    if (collectionData?.length) {
      categoriesWithProducts.push(collectionData);
      const tgids = extractTgidsFromCategories(collectionData);
      if (tgids?.length) {
        allTgids.push(tgids);
      }
    }
  }
  if (categoryIds?.length) {
    const categorySet = new Set(categoryIds);
    const categories = Array.from(categorySet);
    allPromises = generatePromiseForCategoryTours({
      arr: categories,
      hostname,
      city,
      isCategory: true,
    });
    const data = await Promise.all(allPromises);
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
  }
  if (subCategoryIds?.length) {
    const subCategorySet = new Set(subCategoryIds);
    const subCategories = Array.from(subCategorySet);
    allPromises = generatePromiseForCategoryTours({
      arr: subCategories,
      hostname,
      city,
      isSubCategory: true,
    });
    const data = await Promise.all(allPromises);
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
  }

  const allData = categoriesWithProducts?.flat();
  if (allData?.length) {
    const tgids = allTgids?.flat();
    const tgidSet = new Set(tgids);
    const finalTgids = Array.from(tgidSet)?.join(',');
    const allTourGroupData = await fetch(
      `https://api.headout.com/api/v5/tour-group/list?ids[]=${finalTgids}`
    )
      .then((res) => res.json())
      .then((data) => {
        let formattedData = {};
        data?.tourGroups?.forEach((tour) => {
          formattedData[tour?.id] = tour;
        });
        return formattedData;
      });
    const hasShowPageData = Object.keys(showpageData)?.length ? true : false;
    allData?.forEach((c: any) => {
      const { collection, category, subCategory, items } = c || {};
      const { id: categoryId } = collection || category || subCategory || {};

      const allProducts = items?.map((product) => {
        const {
          microBrandsDescriptor,
          microBrandsHighlight,
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
        } = product || {};
        const { displayName: collectionName } = primaryCollection || {};
        const { displayName: primaryCategoryName } = primaryCategory || {};
        const { displayName: primarySubCategoryName } =
          primarySubCategory || {};

        const { finalPrice, originalPrice, currencyCode } = listingPrice || {};
        const currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode];
        const re = /(?:\r\n|\s\|\s)/g;
        const mbDescriptors = microBrandsDescriptor
          ? microBrandsDescriptor.split(re)
          : microBrandsDescriptor;
        const filterHighlights = [
          'Theatre Name',
          'Show Timings',
          'Duration',
          'Your Tickets',
          'Cancellation Policy',
          'Age Limit',
        ];
        const { listicleSchema } = parseShowPageData(microBrandsHighlight);
        let listicleShowSummary, listicleWhyWatch;

        for (let item of listicleSchema) {
          const heading = item['heading'];
          if (heading === 'Listicle Show Why Watch') {
            listicleWhyWatch = item;
          }
          if (heading === 'Listicle Show Summary') {
            listicleShowSummary = item;
          }
        }

        const { detailsObjects: highlights, isSafetyBanner: hasBestSafety } =
          getObject(microBrandsHighlight, filterHighlights) || {};
        const { detailsObjects: reopeningDate } =
          getObject(microBrandsHighlight, ['Opening Date', 'Closing Date']) ||
          {};

        const contentBlocks = {
          hidden: [],
          left: [],
          right: [],
        };
        for (const key of filterHighlights) {
          const isLeftBlock = [
            'Theatre Name',
            'Show Timings',
            'Duration',
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
        const { media } = allTourGroupData[id] || {};
        const { productImages } = media || {};
        const [, descriptionImage] = productImages || [];

        return {
          title: name,
          highlights: null,
          descriptors: mbDescriptors,
          productHighlights: null,
          cardFooter: null,
          theater: null,
          content_theater: null,
          contentBlocks,
          productImage: imageUrl,
          descriptionImage:
            productImages?.length > 1 ? descriptionImage?.url : imageUrl,
          price: finalPrice,
          scratchPrice: originalPrice,
          currencySymbol,
          tgid: id,
          images: productImages,
          averageRating,
          reviewCount,
          ctaBooster: null,
          description: null,
          available: listingPrice?.finalPrice ? true : false,
          overlayBooster: null,
          vendor: null,
          allTags,
          reopeningDate: reopeningDate['Opening Date'],
          closingDate: reopeningDate['Closing Date'],
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
          primaryCollection,
          primaryCategory,
          primarySubCategory,
        };
      });
      finalObj[categoryId] = allProducts;
    });
    data = finalObj;
  }
  return data;
};

export const tourListApiParser = (apiResponse) => {
  const currencySymbolMap = apiResponse?.currencies?.reduce(
    (acc, currency) => ({
      ...acc,
      [currency.code]: { ...currency },
    }),
    {}
  );

  return apiResponse?.tourGroups?.reduce((acc, tour) => {
    const {
      id,
      allTags,
      averageRating,
      callToAction,
      highlights,
      listingPrice,
      media,
      imageUrl,
      microBrandsDescriptor,
      microBrandsHighlight,
      name,
      reviewCount,
    } = tour || {};
    const { productImages, safetyImages } = media || {};
    const { cashbackValue } = listingPrice || {};
    const updatedDescriptors = addCashbackValueToDescriptor({
      descriptor: microBrandsDescriptor,
      cashbackValue,
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
      },
    };
  }, {});
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
  const isCategoryTourList = hasCategoryTourList === true;
  if (!descriptors) return [];
  if (descriptors) {
    switch (true) {
      case isCategoryTourList:
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
    const data = finalDescriptors?.length
      ? finalDescriptors?.filter((desc) => desc?.length)?.map((d) => d?.trim())
      : [];
    return data;
  }
};
