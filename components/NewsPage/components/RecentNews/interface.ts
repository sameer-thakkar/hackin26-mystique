import { PrismicDocumentWithUID } from '@prismicio/types';

export type TRecentNewsProps = {
  allArticles: PrismicDocumentWithUID[];
  CFData: Record<string, any>;
  isMobile: boolean;
};
