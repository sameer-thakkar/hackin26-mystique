import { EReviewRatingFilter } from 'types/reviews';

export type TReviewFilterProps = {
  currentRatingFilter: EReviewRatingFilter | null;
  showOnlyReviewsWithMedia: boolean;
  onFilterChange: (filters: {
    rating: EReviewRatingFilter | null;
    withImages: boolean;
  }) => void;
  productDetails: {
    tgid: string;
    reviewsDetails: Record<string, any>;
    isDesktop: boolean;
    numberOfReviews: number;
  };
};
