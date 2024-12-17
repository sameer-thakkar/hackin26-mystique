import type { TReviewMedia } from 'types/reviews';
import type { TReviewMediaLocation } from 'hooks/useFetchReviewMedia';

export type TFetchReviewsCallback = (
  id: string | number,
  offset?: number,
  limit?: number
) => void;

export type TReviewMediaProp = TReviewMedia & {
  location: TReviewMediaLocation;
};

export type TSnapshotSectionProps = {
  onImageClick: (params: TReviewMediaLocation) => void;
  isDesktop?: boolean;
  reviewMedias: Array<TReviewMediaProp>;
  infiniteList?: {
    fetchNext: () => void;
    canFetch: boolean;
  };
};

export type TCarouselItemProps = Omit<
  TReviewMediaProp,
  'fileSize' | 'fileType'
> & {
  isLoaded: boolean;
  onLoad: () => void;
  onClick: () => void;
};
