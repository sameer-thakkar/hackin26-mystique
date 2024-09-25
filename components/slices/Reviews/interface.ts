import type { SwiperOptions } from 'swiper';

export type ReviewsProps = {
  title: string;
  reviews: any[];
  type?: string;
  isMobile?: boolean;
  showNewDesign?: boolean;
  swiperConfigOverride?: SwiperOptions;
  shouldTrackPageSectionView?: boolean;
  onSlideChange?: () => void;
  truncateLength?: number;
};
