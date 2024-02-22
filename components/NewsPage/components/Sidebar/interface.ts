import { PrismicDocumentWithUID } from '@prismicio/types';
import type { ShowpageDocument } from 'types.prismic';
import { TMediaData } from 'components/NewsPage/ArticlePage/interface';
import { TourGroupDataType } from 'components/NewsPage/interface';

export type TShowCardProps = {
  showData: TourGroupDataType;
  showPageUid: string;
  verticalPoster: string;
  showBookNowHeading?: boolean;
};

export type TSideBarProps = {
  content: {
    tgidMappingData: TourGroupDataType;
    featuredArticles: PrismicDocumentWithUID[];
    showPageDocuments: ShowpageDocument[];
    mediaData: TMediaData[];
    tgid: number;
    newsLandingPageUrl: string;
  };
};
