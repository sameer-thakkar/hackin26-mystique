import type { TImageGalleryProps } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';

export type TExpandedGalleryProps = {
  images: Array<{
    url: string;
    alt: string;
    [key: string]: any;
  }>;
  videoUrl?: string | null;
  controller?: TImageGalleryProps['controller'];
  isMobile?: boolean;
  onVideoPlayerReady?: () => void;
};
