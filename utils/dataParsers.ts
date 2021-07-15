import {
  getObject,
  parseShowPageData,
} from 'components/ShowPages/parseShowPage';
import { CURRENCY_SYMBOL_MAP } from 'const/index';
import { fetchCategory } from 'utils/apiUtils';

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
export const categoryTourListParser = async (
  obj: categoryTourListParserProps
) => {
  const categoryIds = [];
  const { tourListCategory, hostname, showpages, categoryCarousel } = obj || {};

  const sliceObj = tourListCategory?.length
    ? tourListCategory?.reduce((acc, curr) => acc + curr)
    : {};
  const categoryCarouselObj = categoryCarousel?.length
    ? categoryCarousel?.reduce((acc, curr) => acc + curr)
    : {};
  if (sliceObj.items?.length) {
    sliceObj?.items?.forEach((c) => categoryIds?.push(c.category));
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
  if (categoryIds?.length) {
    const categorySet = new Set(categoryIds);
    const ids = Array.from(categorySet);
    const allPromises = ids?.map(
      async (catId) => await fetchCategory(catId, hostname)
    );
    const allCategories = await Promise.all(allPromises);
    let finalObj = {};

    const categoriesWithProducts = allCategories?.filter(
      (cat: any) => cat?.products?.length
    );
    const allTgids = categoriesWithProducts
      .map((category: any) => category?.products?.map((product) => product.id))
      ?.flat()
      ?.join(',');
    const allTourGroupData = await fetch(
      `https://api.headout.com/api/v5/tour-group/list?ids[]=${allTgids}`
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
    categoriesWithProducts?.forEach((c: any) => {
      const { products, categories } = c;
      const allProducts = products?.map((product) => {
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
          primaryCategory,
        } = product;
        const { finalPrice, originalPrice, currencyCode } = listingPrice || {};
        const currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode];
        const re = /(?:\r\n|\s\|\s)/g;
        const mbDescriptors = microBrandsDescriptor.split(re);
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
        const categoryName = primaryCategory?.displayName;
        let category;
        switch (categoryName) {
          case 'London Musicals':
            category = 'Musical';
            break;
          case 'London Plays':
            category = 'Plays';
            break;
          case 'London Ballet Tickets':
            category = 'Ballets';
            break;
          default:
            category = categoryName;
        }

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
          category,
          microBrandsHighlight: highlights,
          listingPrice,
          safetyImages: null,
          showPageUid: hasShowPageData ? showpageData[id] : null,
          listicleShowSummary,
          listicleWhyWatch,
        };
      });
      const categoryId = categories?.length ? categories[0]?.id : null;
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
