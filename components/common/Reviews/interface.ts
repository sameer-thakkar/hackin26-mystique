import { SwiperProps } from 'swiper/react';
import { TMediaData } from 'components/NewsPage/ArticlePage/interface';
import { TTrackEvent } from 'utils/analytics';

export type TReviewsProp = {
  heading: string;
  reviews: Record<string, any>;
  isMobile: boolean;
  mediaData: TMediaData[];
  overrideSwiperProps?: SwiperProps;
  trackingObject: TTrackEvent;
};
