import { PrismicDocumentWithUID } from '@prismicio/types';

export type TNewsLandingPageProps = {
  featuredArticles: PrismicDocumentWithUID[];
  CFData: Record<string, any>;
};
