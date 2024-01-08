import { PrismicDocumentWithUID } from '@prismicio/types';

export type TDesktopMoreReadsProps = {
  content: {
    uniqueArticlesWithSameTgidData: PrismicDocumentWithUID[];
    featuredArticles: PrismicDocumentWithUID[];
    CFData: Record<string, any>;
    newsLandingPageUrl: string;
  };
};

export type TNumberOfImagesInCarousel = 0 | 1 | 2 | 3;
