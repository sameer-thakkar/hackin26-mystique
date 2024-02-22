import { TTrackEvent } from 'utils/analytics';

export type TReviewUIProps = {
  repeatableContent: Record<string, any>[];
  showSortBySelector: boolean;
  isMobile: boolean;
  isLoading: boolean;
  handleOnClick: () => void;
  showLoadMoreCTA: boolean;
};

export type TReviewsProps = {
  criticReviewsData: Record<string, any>[];
  reviewsData: Record<string, any>;
  tgid: number;
  isMobile: boolean;
  trackingObject: TTrackEvent;
};
