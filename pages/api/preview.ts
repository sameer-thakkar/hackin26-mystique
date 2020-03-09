import Prismic from 'prismic-javascript';
import { apiEndpoint, linkResolver } from '../../prismic-config';

export default function handle(req, res) {
  const token = req.query.token;

  Prismic.getApi(apiEndpoint, { req })
    .then(async api => {
      const redirectUri = await api.previewSession(token, linkResolver, '/');
      const masterRef = api.refs.find(ref => {
        return ref.isMasterRef === true;
      });
      const ref = masterRef.ref;

      return {
        redirectUri,
        ref,
      };
    })
    .then(({ redirectUri, ref }) => {
      res.writeHead(302, {
        Location: `${redirectUri}&ref=${ref}`,
      });
      res.end();
    });
}
