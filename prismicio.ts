import * as Prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

const apiEndpoint = 'https://mystique.cdn.prismic.io/api/v2';

export function createClient(config: prismicNext.CreateClientConfig = {}) {
  const client = Prismic.createClient(apiEndpoint);

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });
  return client;
}
