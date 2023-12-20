import type { ShowpageDocument } from 'types.prismic';
import type { TourGroupDataType } from 'components/NewsPage/interface';

export type TMediaPlayerProps = {
  trailerData: TourGroupDataType[];
  showPageDocuments: ShowpageDocument[];
  videoData: Record<string, string>;
};
