import { PrismicDocumentWithUID } from '@prismicio/types';

export type TMobileMoreReadsProps = {
  content: {
    uniqueArticlesWithSameTgidData: PrismicDocumentWithUID[];
    featuredArticles: PrismicDocumentWithUID[];
    CFData: Record<string, any>;
  };
  showAllNewsCTA: boolean;
  heading: string;
  showMoreCTAText: string;
  numberOfArticlesToShow: number;
  initialArticlesToShow: number;
};
