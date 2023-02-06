import type { NextApiRequest, NextApiResponse } from 'next';
import Prismic from 'prismic-javascript';
import { apiEndpoint } from 'config/prismic-config';
import { getHeadoutLanguagecode } from 'utils';
import { convertUidToUrl } from 'utils/urlUtils';
import { LANGUAGE_MAP } from 'const/index';

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const { uid, type, lang, ref } = req.query ?? {};

  Prismic.getApi(apiEndpoint, { req })
    .then((api) => {
      if (type) {
        return api.getByUID(String(type), String(uid), {
          lang: String(lang),
          ref: String(ref),
        });
      }
    })
    .then((response) => {
      const pageUrl = convertUidToUrl({
        uid: String(uid),
        lang: getHeadoutLanguagecode(String(lang) ?? LANGUAGE_MAP.en.locale),
      });
      const host = req.headers['host'];
      const redirectUrl =
        !response || host?.startsWith('localhost:')
          ? `http://${host}?mystique_uid=${uid}&lang=${lang}&previewSession=true`
          : `${pageUrl}?previewSession=true`;
      res.writeHead(302, {
        Location: redirectUrl,
      });
      res.end();
    });
}
