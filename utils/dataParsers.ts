import {
  getObject,
  parseShowPageData,
} from 'components/ShowPages/parseShowPage';
import { CURRENCY_SYMBOL_MAP } from 'const/index';
import { generatePromiseForCategoryTours } from 'utils';

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

interface categoryTourListParserProps {
  tourListCategory: any[];
  hostname: string;
  showpages: any;
  categoryCarousel?: any[];
}

const extractTgidsFromCategories = (arr) => {
  if (arr?.length > 0) {
    return arr
      ?.map((data) => data?.items?.map((product) => product?.id))
      ?.flat();
  }
};

export const categoryTourListParser = async (
  obj: categoryTourListParserProps
) => {
  const categoryIds = [];
  const subCategoryIds = [];
  const collectionIds = [];
  const { tourListCategory, hostname, showpages, categoryCarousel } = obj || {};

  const sliceObj = tourListCategory?.length
    ? tourListCategory?.reduce((acc, curr) => acc + curr)
    : {};
  const { primary, items: slices } = sliceObj || {};
  const city = primary?.city?.cityCode;
  const categoryCarouselObj = categoryCarousel?.length
    ? categoryCarousel?.reduce((acc, curr) => acc + curr)
    : {};
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
  if (categoryCarouselObj.primary?.category_id) {
    categoryIds.push(categoryCarouselObj.primary?.category_id);
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
          dfListingPrice: null,
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
    const listingPrice = tour.listingPrice
      ? {
          ...tour.listingPrice,
          ...currencySymbolMap[tour.listingPrice?.currencyCode],
        }
      : null;
    return {
      ...acc,
      [tour.id]: {
        title: tour.name,
        price: tour.listingPrice?.finalPrice,
        scratchPrice: tour.listingPrice?.originalPrice,
        currency: tour.listingPrice?.currencyCode,
        image: tour.imageUrl,
        reviewCount: tour.reviewCount,
        averageRating: tour.averageRating,
        callToAction: tour.callToAction,
        allTags: [
          ...tour.allTags,
          'SAFETY_MASK_STAFF',
          'SAFETY_TEMPERATURE_GUEST',
          'SAFETY_CLEANED_EQUIPMENTS',
          'SAFETY_RESTRICTED_CAPACITY',
        ],
        dfListingPrice: tour.discountedFuturesListingPrice,
        listingPrice,
        tgid: tour.id,
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
