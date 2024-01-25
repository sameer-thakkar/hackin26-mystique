import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrismicDocument } from 'utils/prismicUtils';
import {
  MICROBRANDS_URL,
  SHORTER_CACHE_AGE,
  X_CACHE_HEADER_KEY,
} from 'const/index';

const getPrismicDocumentData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { query, headers } = req;
  const { host } = headers ?? window.location;
  const { uid, lang, isDev } = (query as unknown) as {
    uid: string;
    lang: string;
    isDev: boolean;
  };

  const params = new URLSearchParams({
    isDev: String(isDev),
  });

  params.sort();

  const domain = isDev ? `http://${host}` : MICROBRANDS_URL;
  const endpoint = `${domain}/api/prismic/get-document-type/${uid}/`;

  const contentTypeResponse = await fetch(endpoint);

  if (!contentTypeResponse.ok) {
    res
      .status(contentTypeResponse.status)
      .json({ statusCode: contentTypeResponse.status });
    return;
  }

  const contentType = await contentTypeResponse.json();

  if (contentTypeResponse.ok && contentType?.type) {
    const prismicDocument = await getPrismicDocument({
      isDev,
      req,
      uid,
      lang,
      contentType: contentType.type,
    });

    // @ts-expect-error redirectInfo & shouldHaveShorterTtl is not present in all document response hence the error
    const { CMSContent, statusCode, shouldHaveShorterTtl, redirectInfo } =
      prismicDocument ?? {};

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

    const cacheHeader = contentTypeResponse.headers.get(X_CACHE_HEADER_KEY);
    const cacheAge = contentTypeResponse.headers.get('age');

    res.status(200).json({
      CMSContent,
      ContentType: contentType.type,
      shouldPageHaveShorterTtl,
      prismicDocumentTypeApiCacheStatus: `${cacheHeader}, Age: ${
        cacheAge ?? -1
      }`,
    });
  }
};

export default getPrismicDocumentData;
