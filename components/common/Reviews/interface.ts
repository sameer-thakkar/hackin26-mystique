import { TMediaData } from 'components/NewsPage/ArticlePage/interface';

export type TReviewsProp = {
  heading: string;
  reviews: Record<string, any>[];
  isMobile: boolean;
  mediaData: TMediaData[];
};
