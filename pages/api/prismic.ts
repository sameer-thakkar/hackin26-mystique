import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrismicDocument } from 'utils/prismicUtils';

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

  if (redirectInfo) {
    res.status(200).json({ redirectInfo });
    return;
  } else if (statusCode) {
    res.status(200).json({ statusCode });
    return;
  }
  res.status(200).json({ CMSContent, ContentType });
};

export default getPrismicDocumentData;
