export interface IDesktopBannerProps {
  bannerImages: Array<IBannerImageProps>;
}

export type IBannerImageProps = {
  url: string;
  bannerHeading: string;
  bannerSubText: string;
  alt: string;
  showPageUrl?: {
    url: string;
  };
};
