import { TImageGalleryProps } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';

export type TGalleryProps = {
  images: TImageGalleryProps['imageUploads'];
  getAssociatedReview?: TImageGalleryProps['getAssociatedReview'];
  controller?: TImageGalleryProps['controller'];
  infiniteList?: TImageGalleryProps['infiniteList'];
  onClose?: () => void;
};
