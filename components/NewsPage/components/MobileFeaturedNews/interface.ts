import { PrismicDocumentWithUID } from '@prismicio/types';

export type TMobileFeaturedNewsProps = {
  featuredNewsContent: {
    content: PrismicDocumentWithUID[];
    CFData: Record<string, any>;
  };
  newsLandingPageUrl: string;
};
