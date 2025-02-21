import { TScorpioData } from 'components/AirportTransfers/interface';

// Constants for Bayesian average calculation
const BAYESIAN_CONSTANTS = {
  MIN_RATINGS_WEIGHT: 50, // Minimum number of ratings to consider for weighting
  SYSTEM_MEAN_RATING: 4.0, // Assumed system-wide mean rating
};

const calculateBayesianRating = (
  rating: number,
  totalRatings: number,
  systemMean = BAYESIAN_CONSTANTS.SYSTEM_MEAN_RATING,
  minRatings = BAYESIAN_CONSTANTS.MIN_RATINGS_WEIGHT
) => {
  // Weight (w) calculation: approaches 1 as totalRatings increases
  const weight = totalRatings / (totalRatings + minRatings);

  // Bayesian average formula: (w * itemAverage) + ((1-w) * systemMean)
  return weight * rating + (1 - weight) * systemMean;
};

export function getApplicableBoosterTGIDs(
  scorpioData: Record<string, TScorpioData>
) {
  const products = extractProductInfo(scorpioData);

  // products with valid tgids
  const validProducts = products.filter((p) => p.tgid);

  if (validProducts.length < 4) {
    return {
      MOST_LOVED: [],
      SPECIAL_DEAL: [],
    };
  }

  // Get top product with actual discounts
  const specialDeal = products
    .filter((p) => p.discount > 0)
    .sort((a, b) => b.discount - a.discount)?.[0];

  // Find highest rated product overall which is not NEW Product(showRatings is false)
  const highestRatedProduct = products
    .filter((p) => p.showRatings)
    .filter((p) => p.rating > 4)
    .map((p) => ({
      ...p,
      bayesianRating: calculateBayesianRating(p.rating, p.totalRatings || 0),
    }))
    .sort((a, b) => b.bayesianRating - a.bayesianRating)[0];

  // If highest rated product is a special deal, return no top rated products
  const mostLoved =
    specialDeal?.tgid && highestRatedProduct?.tgid === specialDeal?.tgid
      ? []
      : [highestRatedProduct?.tgid];

  return {
    MOST_LOVED: mostLoved,
    SPECIAL_DEAL: [specialDeal?.tgid],
  };
}

function extractProductInfo(data: Record<string, TScorpioData>) {
  const products = Object.entries(data).map(([tgid, details]) => {
    return {
      tgid: Number(tgid),
      rating: details.averageRating || 0,
      totalRatings: details.reviewsDetails?.ratingsCount || 0,
      showRatings: details.reviewsDetails?.showRatings || false,
      discount: details.listingPrice?.bestDiscount || 0,
    };
  });
  return products;
}

export const getPOIBooster = (
  tgid: number,
  scorpioData: Record<string, TScorpioData>
) => {
  const poiBoosterTGIDs = getApplicableBoosterTGIDs(scorpioData);

  // Return the first matching booster type
  for (const boosterType in poiBoosterTGIDs) {
    if (
      poiBoosterTGIDs[boosterType as keyof typeof poiBoosterTGIDs]?.includes(
        tgid
      )
    ) {
      return boosterType;
    }
  }

  return null;
};
