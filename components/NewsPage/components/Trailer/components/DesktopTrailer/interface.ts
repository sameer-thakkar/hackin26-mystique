import { PrismicDocumentWithUID } from '@prismicio/types';
import { TourGroupDataType } from 'components/NewsPage/interface';

export type TDesktopTrailerProps = {
  content: {
    trailerData: TourGroupDataType[];
    CFData: Record<string, any>;
    showPageDocuments: PrismicDocumentWithUID[];
    tgid?: number;
    videoData: Record<string, string>;
  };
};
