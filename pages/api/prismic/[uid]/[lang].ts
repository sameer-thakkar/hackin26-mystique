import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrismicDocument } from 'utils/prismicUtils';
import { PRISMIC_API_CALL_THROTTLED } from 'const/index';

const getPrismicDocumentData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { query } = req;
  const { uid, lang, isDev } = (query as unknown) as {
    uid: string;
    lang: string;
    isDev: boolean;
  };

  const {
    CMSContent,
    ContentType,
    redirectInfo,
    statusCode,
  } = await getPrismicDocument({
    isDev,
    req,
    uid,
    lang,
  });

  const isThrottled = (req as any)[PRISMIC_API_CALL_THROTTLED];

  if (redirectInfo) {
    res.status(200).json({ redirectInfo });
    return;
  } else if (statusCode || isThrottled) {
    res.setHeader('Cache-Control', 'max-age=10');
    res.status(isThrottled ? 429 : (statusCode as number)).json({ statusCode });
    return;
  }
  res.status(200).json({ CMSContent, ContentType });
};

export default getPrismicDocumentData;
