import { PrismicDocumentWithUID } from '@prismicio/types';
import { TMediaData } from 'components/NewsPage/ArticlePage/interface';
import { TourGroupDataType } from 'components/NewsPage/interface';

export type TShowCardProps = {
  showData: TourGroupDataType;
  showPageUid: string;
  verticalPoster: string;
};

export type TSideBarProps = {
  content: {
    tgidMappingData: TourGroupDataType;
    featuredArticles: PrismicDocumentWithUID[];
    showPageDocuments: PrismicDocumentWithUID[];
    mediaData: TMediaData[];
    tgid: number;
  };
};
