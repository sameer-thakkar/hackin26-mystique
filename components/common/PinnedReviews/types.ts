import { TReview } from 'types/reviews';

export type TPinnedReviewsProps = {
  lang?: string;
  isMobile?: boolean;
  pinnedReviews: {
    items?: TReview[];
    displayConfig?: {
      exposePinnedReviews?: boolean;
      exposeLoadMore?: boolean;
    };
  };
  reviewsDetails?: {
    averageRating?: number;
    reviewsCount?: number;
  };
  onSeeMoreClick?: () => void;
  tgid?: string;
};
