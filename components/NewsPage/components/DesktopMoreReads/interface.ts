import { PrismicDocumentWithUID } from '@prismicio/types';

export type TDesktopMoreReadsProps = {
  content: {
    uniqueArticlesWithSameTgidData: PrismicDocumentWithUID[];
    featuredArticles: PrismicDocumentWithUID[];
    CFData: Record<string, any>;
  };
};

export type TNumberOfImagesInCarousel = 0 | 1 | 2 | 3;
