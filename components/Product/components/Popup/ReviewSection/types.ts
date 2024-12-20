import type { TImageGalleryProps } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import type { TReviewMediasResponse } from 'utils/apiUtils';
import type { TSnapshotSectionProps } from './Snapshots/interface';

export type TReviewSectionProps = {
  reviewsDetails: Record<string, any>;
  tgid: string | number;
  topReviews?: TReviewMediasResponse['items'];
  tourGroupUrl?: string;
  showTitle?: boolean;
  showExternalButton?: boolean;
  isBot?: boolean;
};

export type TReviewSectionMobileProps = TReviewSectionProps & {
  imageGalleryController?: TImageGalleryProps['controller'];
  getReviewMediaGlobalLocation?: (
    reviewId: number,
    localIndex: number
  ) => number | undefined;
  snapshotSectionProps?: TSnapshotSectionProps;
};
