import { TPrismicTrustBooster } from 'utils/prismicUtils/interface';

export type TCategoryPageBannerProps = {
  heading: string;
  isMobile: boolean;
  bannerImgUrl: string;
  breadcrumbs: Record<string, any>;
  isMonthOnMonthPage?: boolean;
  showTrustBoosters?: boolean;
  trustBoosters?: TPrismicTrustBooster[];
  isEntertainmentBanner?: boolean;
};
