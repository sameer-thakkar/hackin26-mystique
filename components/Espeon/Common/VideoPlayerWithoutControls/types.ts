type TImageObj = {
  url: string;
  altText?: string;
  title?: string;
};

export type TVideoTypeProps = {
  url: string;
  fallbackImage?: TImageObj;
  isMuted?: boolean;
  shouldAutoPlay?: boolean;
  isLooped?: boolean;
  width?: number;
  height?: number;
  currentlyPlaying?: boolean;
  isBanner?: boolean;
  responsive?: boolean;
  eventTracking?: boolean;
  useVideoPoster?: boolean;
  aria?: {
    labelledBy?: string;
    label?: string;
  };
  preventVideoClickEventPropagation?: boolean;
  imageDensity?: number;
  priortizeImage?: boolean;
  trackEvent?: (event: any) => void;
};
