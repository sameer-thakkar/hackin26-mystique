import { TPrismicTrustBooster } from 'utils/prismicUtils/interface';

export interface IMediaProps {
  index: number;
  item: any;
  fallbackImage: string;
  className?: string;
  hasSubText?: boolean;
  showModifiedBanner?: boolean;
  lttOrBroadway?: ELttOrBroadway | null;
}

export interface IBannerProps {
  bannerImages: any[];
  allTours: any;
  trustBoosters?: TPrismicTrustBooster[];
  isEntertainmentBanner?: boolean;
  isLttCopyExperimentEligible?: boolean;
  lttCopyExperimentVariant?: string | null;
  lttOrBroadway?: ELttOrBroadway | null;
}

export enum ELttOrBroadway {
  LTT = 'LTT',
  BROADWAY = 'BROADWAY',
}
