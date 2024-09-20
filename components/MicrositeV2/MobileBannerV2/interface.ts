import { TPrismicTrustBooster } from 'utils/prismicUtils/interface';

export interface IMediaProps {
  index: number;
  item: any;
  fallbackImage: string;
  className?: string;
  hasSubText?: boolean;
}

export interface IBannerProps {
  bannerImages: any[];
  allTours: any;
  trustBoosters?: TPrismicTrustBooster[];
  isEntertainmentBanner?: boolean;
}
