import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'prismicio';
import { getHeadoutLanguagecode } from 'utils';
import { sendLog } from 'utils/logger';
import { convertUidToUrl } from 'utils/urlUtils';
import { LANGUAGE_MAP } from 'const/index';

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const { uid, type, lang, ref } = req.query ?? {};

  try {
    const prismicClient = createClient();
    if (type) {
      // @ts-expect-error couldn't figure how to extract the unions for type
      const pageData = prismicClient.getByUID(type, uid, {
        lang: String(lang),
        ref: String(ref),
      });

      const pageUrl = convertUidToUrl({
        uid: String(uid),
        lang: getHeadoutLanguagecode(String(lang) ?? LANGUAGE_MAP.en.locale),
      });
      const host = req.headers['host'];
      const redirectUrl =
        !pageData || host?.startsWith('localhost:')
          ? `http://${host}?mystique_uid=${uid}&lang=${lang}&previewSession=true`
          : `${pageUrl}?previewSession=true`;
      res.writeHead(302, {
        Location: redirectUrl,
      });
      res.end();
    }
  } catch (error) {
    sendLog({
      err: error,
      message: `[resolve.api] getByUid failed !!`,
    });
    res.end();
  }
}
