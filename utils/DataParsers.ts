export const uncategorizedToursListParser = (
  uncategorizedToursList,
  initialVal
) => {
  return uncategorizedToursList.reduce(
    (accum, tour) => {
      const {
        tgid,
        tour_title_override: title,
        marketing_highlights_override: descriptors,
        tour_description_override: highlights,
      } = tour;
      const hasHighlights = highlights.filter(item => item.text);
      if (!title || !hasHighlights || !descriptors) {
        return [...accum, tgid];
      }
      return accum;
    },
    [...initialVal]
  );
};

export const tourListApiParser = apiResponse => {
  return apiResponse?.tourGroups?.reduce((acc, tour) => {
    return {
      ...acc,
      [tour.id]: {
        title: tour.name,
        price: tour.listingPrice?.finalPrice,
        scratchPrice: tour.listingPrice?.originalPrice,
        currency: apiResponse.currencies[0].currency,
        image: tour.imageUrl,
        reviewCount: tour.reviewCount,
        averageRating: tour.averageRating,
        callToAction: tour.callToAction,
      },
    };
  }, {});
};
