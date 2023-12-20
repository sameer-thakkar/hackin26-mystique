import type { ShowpageDocument } from 'types.prismic';
import type { TourGroupDataType } from 'components/NewsPage/interface';

export type TMobileTrailerProps = {
  content: {
    trailerData: TourGroupDataType[];
    showPageDocuments: ShowpageDocument[];
    videoData: Record<string, string>;
  };
};
