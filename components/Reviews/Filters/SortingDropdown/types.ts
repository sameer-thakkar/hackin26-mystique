import { ReactNode } from 'react';
import { EReviewSortType } from 'types/reviews';

export type TSortingDropdownProps = {
  currentSortType: EReviewSortType;
  isDesktop?: boolean;
  onSortTypeChange: (sortType: EReviewSortType) => void;
  productDetails: {
    tgid: string | number;
    reviewsDetails: Record<string, any>;
    isDesktop: boolean;
    numberOfReviews: number;
  };
};

export type TSortingOverlayProps = {
  isDesktop?: boolean;
  changeRenderOverlayState: (p: boolean) => void;
  children?: ReactNode;
};
