import { MutableRefObject } from 'react';

export type TImageGalleryController = {
  open: () => void;
  close: () => void;
};

export type TImageGalleryProps = {
  imageUploads: Array<{
    url: string;
    alt: string;
    title?: string;
    credit?: string;
  }>;
  startFrom?: number;
  onHide?: () => void;
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
  controller?: MutableRefObject<TImageGalleryController | undefined>;
};
