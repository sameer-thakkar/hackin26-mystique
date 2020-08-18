import Prismic from 'prismic-javascript';
import { apiEndpoint } from '../../config/prismic-config';

export default function handle(req, res) {
  const { uid, type, lang, ref } = req.query;

  Prismic.getApi(apiEndpoint, { req })
    .then((api) =>
      api.getByUID(type, uid, {
        lang,
        ref,
      })
    )
    .then((response) => {
      if (response && !response.data.page_url) {
        // if response exists (which implies document is published)
        // then Page URL should exist!
        res.send('Please enter `Page URL` in Prismic for its Preview to work!');
        res.end();
        return;
      }
      const host = req.headers['host'];
      const redirectUrl =
        !response || host.startsWith('localhost:')
          ? `http://${host}?mystique_uid=${uid}&lang=${lang}&previewSession=true`
          : `${response.data.page_url}?previewSession=true`;
      res.writeHead(302, {
        Location: redirectUrl,
      });
      res.end();
    });
}
