import { TBannerTrustBooster } from '../BannerV2TrustBooster/interface';

export type TCategoryPageBannerProps = {
  heading: string;
  isMobile: boolean;
  bannerImgUrl: string;
  breadcrumbs: Record<string, any>;
  isMonthOnMonthPage?: boolean;
  showTrustBoosters?: boolean;
  trustBoosters?: TBannerTrustBooster[];
  isEntertainmentBanner?: boolean;
};
