import type { NextApiRequest, NextApiResponse } from 'next';
import Prismic from 'prismic-javascript';

import { apiEndpoint, linkResolver } from '../../config/prismic-config';

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const token = req?.query?.token;

  Prismic.getApi(apiEndpoint, { req })
    .then(async (api) => {
      if (token) {
        const redirectUri = await api.previewSession(
          String(token),
          linkResolver,
          '/'
        );
        const masterRef = api.refs.find((ref) => {
          return ref.isMasterRef === true;
        });
        const ref = masterRef?.ref;

        return {
          redirectUri,
          ref,
        };
      }
    })
    .then(({ redirectUri, ref }: any) => {
      res.writeHead(302, {
        Location: `${redirectUri}&ref=${ref}`,
      });
      res.end();
    });
}
