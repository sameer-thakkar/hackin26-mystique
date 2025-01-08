import { SwiperProps } from 'swiper/react';
import type { TReview } from 'types/reviews';
import { TMediaData } from 'components/NewsPage/ArticlePage/interface';
import { TTrackEvent } from 'utils/analytics';

export type TReviewsProp = {
  heading: string;
  reviews: TReviewsComponentPayload;
  isMobile: boolean;
  mediaData: TMediaData[];
  overrideSwiperProps?: SwiperProps;
  trackingObject: TTrackEvent;
};

export type TReviewsComponentPayload = {
  reviewsData: {
    result: {
      reviews: {
        items: TReview[];
      };
    };
  };
  mediaData: {
    resourceEntityMedias: TMediaData[];
    resourceType?: string;
  };
  tgidToReviewsPageUidMapping?: Record<string, string>;
};
