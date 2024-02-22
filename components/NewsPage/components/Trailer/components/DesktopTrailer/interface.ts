import type { ShowpageDocument } from 'types.prismic';
import type { TourGroupDataType } from 'components/NewsPage/interface';

export type TDesktopTrailerProps = {
  content: {
    trailerData: TourGroupDataType[];
    showPageDocuments: ShowpageDocument[];
    tgid?: number;
    videoData: Record<string, string>;
  };
};
