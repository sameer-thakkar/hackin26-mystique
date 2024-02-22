import { TourGroupDataType } from 'components/NewsPage/interface';

export type TMainContentProps = {
  tgidData: TourGroupDataType;
  isMobile: boolean;
  showPageData: Record<string, any>[];
  mediaData: Record<string, any>;
  reviewsData: {
    items: Record<string, any>[];
  };
  contentFramework: Record<string, any>;
};
