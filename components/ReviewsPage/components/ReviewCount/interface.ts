export type TReviewCountProps = {
  averageRating: number;
  ratingsCount: number;
  reviewsCount: number;
  ratingsSplit: Record<string, any>;
  isMobile: boolean;
  handleReviewCountClick: () => void;
};

export type TRatingSplitProps = Pick<
  TReviewCountProps,
  'ratingsSplit' | 'ratingsCount'
>;

export type TRatingStarsProps = Pick<TReviewCountProps, 'averageRating'> & {
  isComponentVisible?: boolean;
};

export type TScaleOfRatings = 1 | 2 | 3 | 4 | 5;
