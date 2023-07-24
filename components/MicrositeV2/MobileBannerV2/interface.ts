export type IMediaProps = {
  index: number;
  item: any;
  fallbackImage: string;
  className?: string;
  hasSubText?: boolean;
};

export type IBannerProps = {
  bannerImages: any[];
  allTours: any;
  pinnedTgid?: any;
};
