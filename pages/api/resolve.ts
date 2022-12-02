import Prismic from 'prismic-javascript';
import { apiEndpoint } from 'config/prismic-config';
import { getHeadoutLanguagecode } from 'utils';
import { convertUidToUrl } from 'utils/urlUtils';

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
      const pageUrl = convertUidToUrl({
        uid,
        lang: getHeadoutLanguagecode(lang),
      });
      const host = req.headers['host'];
      const redirectUrl =
        !response || host.startsWith('localhost:')
          ? `http://${host}?mystique_uid=${uid}&lang=${lang}&previewSession=true`
          : `${pageUrl}?previewSession=true`;
      res.writeHead(302, {
        Location: redirectUrl,
      });
      res.end();
    });
}
