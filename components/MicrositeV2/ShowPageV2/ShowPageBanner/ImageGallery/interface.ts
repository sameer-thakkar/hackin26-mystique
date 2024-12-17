import type { MutableRefObject } from 'react';
import type { TReview } from 'types/reviews';

export enum EPopupState {
  OPEN,
  CLOSED,
  INITIAL,
}

export type TImageGalleryController = {
  open: (index?: number) => void;
  close: () => void;
};

export type TImageGalleryProps = {
  imageUploads: Array<{
    url: string;
    alt: string;
    title?: string;
    credit?: string;
    [key: string]: any;
  }>;
  startFrom?: number;
  onHide?: (reviewInfo?: TReview) => void;
  onShow?: (reviewInfo?: TReview) => void;
  showMoreButton?: boolean;
  hideFirstImageInOverlay?: boolean;
  controlBodyOverflow?: boolean;
  navigation?: 'cross' | 'arrow' | 'none';
  imageDimensions?: {
    spotlight?: {
      height: number;
      width: number;
    };
    thumbnail?: {
      height: number;
      width: number;
    };
  };
  controller?: MutableRefObject<TImageGalleryController | null>;
  infiniteList?: {
    fetchNext: () => void;
    canFetch: boolean;
  };
  title?: string;
  getAssociatedReview?: (reviewId: number) => TReview | undefined;
};
