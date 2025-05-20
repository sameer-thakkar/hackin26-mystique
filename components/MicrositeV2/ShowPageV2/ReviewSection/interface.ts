import type { SwiperProps } from 'swiper/react';
import type { TSnapshotSectionProps } from 'components/Product/components/Popup/ReviewSection/Snapshots/interface';
import type { TReviewMediasResponse } from 'utils/apiUtils';

export type TReviewSectionProps = {
  reviewsDetails: Record<string, any>;
  tgid: string;
  isMobile?: boolean;
  initialReviews?: TReviewMediasResponse['items'];
  numberOfReviewsToFetchAtOnce?: number;
  maximumNumberOfReviews?: number | null;
  showFetchMoreButton?: boolean;
  showSkeleton?: boolean;
  controlledSwiperParams?: SwiperProps;
  showReviews?: boolean;
  onImageClick?: (reviewId: string | number, localIndex: number) => void;
  snapshotSectionProps?: TSnapshotSectionProps;
  numberOfReviewsToShow?: number;
  showCountriesSection?: boolean;
};
