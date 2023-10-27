import { PrismicDocumentWithUID } from '@prismicio/types';
import { TourGroupDataType } from 'components/NewsPage/interface';

export type TMobileTrailerProps = {
  content: {
    trailerData: TourGroupDataType[];
    showPageDocuments: PrismicDocumentWithUID[];
    videoData: Record<string, string>;
  };
};
