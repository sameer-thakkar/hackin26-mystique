import { PrismicDocumentWithUID } from '@prismicio/types';
import { TTrackEvent } from 'utils/analytics';

export type TDesktopMoreReadsProps = {
  content: {
    uniqueArticlesWithSameTgidData: PrismicDocumentWithUID[];
    featuredArticles: PrismicDocumentWithUID[];
    newsLandingPageUrl: string;
  };
  handleCtaClick: () => void;
  trackingObject: TTrackEvent;
};

export type TNumberOfImagesInCarousel = 0 | 1 | 2 | 3;
