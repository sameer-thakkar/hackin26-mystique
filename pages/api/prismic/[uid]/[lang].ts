import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrismicDocument } from 'utils/prismicUtils';
import { SHORTER_CACHE_AGE } from 'const/index';

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
    shouldHaveShorterTtl,
  } = await getPrismicDocument({
    isDev,
    req,
    uid,
    lang,
  });
  let shouldPageHaveShorterTtl = false;

  if (shouldHaveShorterTtl || statusCode) {
    res.setHeader('Cache-Control', `max-age=${SHORTER_CACHE_AGE}`);
    shouldPageHaveShorterTtl = true;
  }

  if (redirectInfo) {
    res.status(200).json({ redirectInfo });
    return;
  } else if (statusCode) {
    res.status(statusCode).json({ statusCode });
    return;
  }
  res.status(200).json({ CMSContent, ContentType, shouldPageHaveShorterTtl });
};

export default getPrismicDocumentData;
