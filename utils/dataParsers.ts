import { getObject } from 'components/ShowPages/parseShowPage';
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

export const categoryTourListParser = async (sliceObj, hostname) => {
  const categoryIds = sliceObj.items?.length
    ? sliceObj?.items?.map((c) => c.category)
    : [];
  let data;
  if (categoryIds?.length) {
    const allPromises = categoryIds?.map(
      async (catId) => await fetchCategory(catId, hostname)
    );
    const allCategories = await Promise.all(allPromises);
    let finalObj = {};
    await allCategories
      ?.filter((cat: any) => cat?.products?.length)
      ?.map((c: any) => {
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
          } = product;
          const { finalPrice, originalPrice, currencyCode } =
            listingPrice || {};
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
          const highlights = getObject(microBrandsHighlight, filterHighlights);

          const { detailsObjects } = highlights || {};
          const contentBlocks = {
            hidden: [],
            left: [],
            right: [],
          };
          for (const [key, value] of Object.entries(detailsObjects)) {
            const isLeftBlock = [
              'Theatre Name',
              'Show Timings',
              'Duration',
            ].includes(key);
            const block = {
              label: key,
              content: value,
              align: isLeftBlock ? 'left' : 'right',
              len: value?.length,
              labelId: key?.toLowerCase()?.split(' ')?.join('-'),
            };
            isLeftBlock
              ? contentBlocks?.left?.push(block)
              : contentBlocks?.right?.push(block);
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
            descriptionImage: imageUrl,
            price: finalPrice,
            scratchPrice: originalPrice,
            currencySymbol,
            tgid: id,
            images: null,
            averageRating,
            reviewCount,
            ctaBooster: null,
            description: null,
            available: listingPrice ? true : false,
            overlayBooster: null,
            vendor: null,
            allTags,
            dfListingPrice: null,
            microBrandsHighlight: highlights,
            listingPrice,
            safetyImages: null,
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
