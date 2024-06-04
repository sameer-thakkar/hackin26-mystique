import { TScorpioData, TTour } from 'components/AirportTransfers/interface';
import { BOOKING_FLOW_TYPE } from 'const/booking';

export function calculateAvgRatingAndTotalReviews(
  scorpioData: Record<number, TScorpioData>
) {
  const scorpioDataArray = Object.values(scorpioData ?? {});

  let sumOfAvgRatings = 0;
  let totalRatingsCount = 0;

  let tgidsWithRatings = 0;

  for (const item of scorpioDataArray) {
    if (item.averageRating && item.ratingCount) {
      sumOfAvgRatings += item.averageRating;
      totalRatingsCount += item.ratingCount;
      tgidsWithRatings++;
    }
  }

  const averageOfAverageRatings = sumOfAvgRatings / tgidsWithRatings;

  return {
    averageRating:
      isNaN(averageOfAverageRatings) || !isFinite(averageOfAverageRatings)
        ? 0
        : averageOfAverageRatings,
    ratingsCount: totalRatingsCount,
  };
}

export const hasPrivateAirportTransfers = (tours: TTour[]) => {
  return tours.some(
    (tour) => tour.flowType === BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER
  );
};
