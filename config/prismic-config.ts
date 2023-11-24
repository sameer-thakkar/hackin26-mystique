import Prismic from 'prismic-javascript';
import type { PrismicDocumentWithUID } from '@prismicio/types';
// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = 'https://mystique.cdn.prismic.io/api/v2';

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
export const accessToken = '';

// -- Link resolution rules
// Manages links to internal Prismic documents
// Modify as your project grows to handle any new routes you've made
export const linkResolver = (doc: PrismicDocumentWithUID) => {
  return `/api/resolve?type=${doc.type}&uid=${doc.uid}&lang=${doc.lang}`;
};

// Additional helper function for Next/Link components
export const hrefResolver = (doc: PrismicDocumentWithUID) => {
  if (doc.type === 'post') {
    return `/post?uid=${doc.uid}`;
  }
  return '/';
};

// -- Client method to query Prismic
// Avoids reinitializing an API connection for every query, handling instead with a Client object
let frontClient: any;

export const Client = (req = null, parentOptions: any = {}) => {
  if (!req && frontClient) return frontClient; // Prevents generating new instances for client side since we don't need the refreshed request object.
  const { ref } = parentOptions;
  // Reinitializes Client only if there's a req object present, which is used for Previews
  const options = Object.assign(
    parentOptions,
    req ? { req } : {},
    accessToken ? { accessToken } : {}
  );
  const apiEndpointURL = new URL(apiEndpoint);
  if (ref) apiEndpointURL.searchParams.set('ref', ref);

  // Connects to the given repository to facilitate data queries
  return Prismic.client(apiEndpointURL.toString(), options);
};
