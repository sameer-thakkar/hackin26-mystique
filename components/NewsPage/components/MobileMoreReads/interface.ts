import { PrismicDocumentWithUID } from '@prismicio/types';
import { TTrackEvent } from 'utils/analytics';

export type TMobileMoreReadsProps = {
  content: {
    uniqueArticlesWithSameTgidData: PrismicDocumentWithUID[];
    featuredArticles: PrismicDocumentWithUID[];
  };
  showAllNewsCTA: boolean;
  heading: string;
  showMoreCTAText: string;
  numberOfArticlesToShow: number;
  initialArticlesToShow: number;
  trackingObject?: TTrackEvent;
  handleCtaClick?: () => void;
  newsLandingPageUrl?: string;
};
