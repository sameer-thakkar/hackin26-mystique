import { TPrismicTrustBooster } from 'utils/prismicUtils/interface';

export type TBannerTrustBooster = {
  name: string;
  icon: string;
  description: string;
};

export type THardcodedTrustBooster = {
  name: string;
  icon: Element;
  description: string;
};

export type TTrustBoosterProps = {
  isMobile?: boolean;
  isHOHORevamp?: boolean;
  trustBoosters?: TPrismicTrustBooster[];
  isEntertainmentBanner?: boolean;
};
