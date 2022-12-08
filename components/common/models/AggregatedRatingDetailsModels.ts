export interface AggregatedRatingDetails {
  id: number;
  displayName: string;
  metaDescription: string;
  ratingsCount: number;
  averageRating: number;
  listingPrice: number;
  currency: string;
  heroImageUrl?: string;
  cardImageUrl?: string;
}

export interface AggregatedRatingInfo {
  aggregatedRatingInfo: AggregatedRatingDetails;
}
