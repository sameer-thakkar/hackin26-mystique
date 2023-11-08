import { TScorpioData } from 'components/AirportTransfers/PopulateAirportTransferProducts/interfaces';

export function calculateAvgRatingAndTotalReviews(
  scorpioData: Record<number, TScorpioData>
) {
  const scorpioDataArray = Object.values(scorpioData ?? {});

  let sumOfAvgRatings = 0;
  let totalRatingsCount = 0;

  for (const item of scorpioDataArray) {
    if (item.averageRating && item.ratingCount) {
      sumOfAvgRatings += item.averageRating;
      totalRatingsCount += item.ratingCount;
    }
  }

  const averageOfAverageRatings = sumOfAvgRatings / scorpioDataArray.length;

  return {
    averageRating: isNaN(averageOfAverageRatings) ? 0 : averageOfAverageRatings,
    ratingsCount: totalRatingsCount,
  };
}
