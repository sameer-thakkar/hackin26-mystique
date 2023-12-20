import type { ShowpageDocument } from 'types.prismic';
import type { TourGroupDataType } from 'components/NewsPage/interface';

export type TTrailerProps = {
  content: {
    trailerSectionData: TourGroupDataType[];
    CFData: Record<string, any>;
    showPageDocuments: ShowpageDocument[];
    tgid?: number;
    videoData: Record<string, string>;
  };
  isMobile: boolean;
};
