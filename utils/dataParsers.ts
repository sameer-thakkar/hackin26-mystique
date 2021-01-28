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
