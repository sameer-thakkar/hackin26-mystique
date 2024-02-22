import { PrismicDocumentWithUID } from '@prismicio/types';

export type TMobileFeaturedNewsProps = {
  featuredNewsContent: {
    content: PrismicDocumentWithUID[];
  };
  newsLandingPageUrl: string;
};
