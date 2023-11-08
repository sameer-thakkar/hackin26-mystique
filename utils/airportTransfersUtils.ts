import { TScorpioData } from 'components/AirportTransfers/PopulateAirportTransferProducts/interfaces';

export function calcAvgRatingAndTotalReviews(
  scorpioData: Record<number, TScorpioData>
) {
  const scorpioDataArray = Object.values(scorpioData ?? {});

  let sumOfAvgRatings = 0;
  let totalReviewCount = 0;

  for (const item of scorpioDataArray) {
    if (item.averageRating && item.reviewCount) {
      sumOfAvgRatings += item.averageRating;
      totalReviewCount += item.reviewCount;
    }
  }

  const averageOfAverageRatings = sumOfAvgRatings / scorpioDataArray.length;

  return {
    averageRating: isNaN(averageOfAverageRatings) ? 0 : averageOfAverageRatings,
    ratingsCount: totalReviewCount,
  };
}
