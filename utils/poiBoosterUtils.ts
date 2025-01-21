import { TScorpioData } from 'components/AirportTransfers/interface';

export function getApplicableBoosterTGIDs(
  scorpioData: Record<string, TScorpioData>
) {
  const products = extractProductInfo(scorpioData);

  // Get top 2 products with actual discounts
  const specialDeals = products
    .filter((p) => p.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 2)
    .map((p) => p.tgid);

  // Find highest rated product overall
  const highestRatedProduct = products.sort((a, b) => b.rating - a.rating)[0];

  // If highest rated product is a special deal, return no top rated products
  const topRated = specialDeals.includes(highestRatedProduct?.tgid)
    ? []
    : [highestRatedProduct?.tgid];

  return {
    TOP_RATED: topRated,
    SPECIAL_DEAL: specialDeals,
  };
}

function extractProductInfo(data: Record<string, TScorpioData>) {
  const products = Object.entries(data).map(([tgid, details]) => {
    return {
      tgid: Number(tgid),
      rating: details.averageRating || 0,
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
