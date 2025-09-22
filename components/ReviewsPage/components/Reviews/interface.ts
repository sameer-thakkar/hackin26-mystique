import { TTrackEvent } from 'utils/analytics';
import type { LanguagesUnion } from 'const/index';

export type TReviewUIProps = {
  repeatableContent: Record<string, any>[];
  showSortBySelector: boolean;
  isMobile: boolean;
  isLoading: boolean;
  handleOnClick: () => void;
  showLoadMoreCTA: boolean;
  lang: LanguagesUnion;
};

export type TReviewsProps = {
  criticReviewsData: Record<string, any>[];
  reviewsData: Record<string, any>;
  tgid: number;
  isMobile: boolean;
  trackingObject: TTrackEvent;
};
