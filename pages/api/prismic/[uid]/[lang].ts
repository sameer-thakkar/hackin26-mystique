import type { NextApiRequest, NextApiResponse } from 'next';
import { constructHeaders } from 'utils/apiUtils';
import { getDocsForListicleSlice } from 'utils/contentPageUtils';
import getCategoryHeaderMenu from 'utils/headerUtils/getCategoryHeaderMenu';
import { checkIfCategoryHeaderExists } from 'utils/helper';
import { sendLog } from 'utils/logger';
import { traceError } from 'utils/logutils';
import { getPrismicDocument } from 'utils/prismicUtils';
import {
  conditionalPromise,
  labeledPromiseAllSettled,
} from 'utils/promiseUtils';
import {
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  MB_CATEGORISATION,
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
  const { uid, lang, isDev } = query as unknown as {
    uid: string;
    lang: string;
    isDev: boolean;
  };
  const requestHeaders = constructHeaders({});

  const params = new URLSearchParams({
    isDev: String(isDev),
  });

  params.sort();

  const domain = isDev ? `http://${host}` : MICROBRANDS_URL;
  const endpoint = `${domain}/api/prismic/get-document-type/${uid}/`;

  let contentTypeResponse: Response;

  try {
    contentTypeResponse = await fetch(endpoint, {
      headers: requestHeaders,
    });
  } catch (err) {
    traceError({ error: err, uid, lang });

    sendLog({
      message: `[getPrismicDocumentData] Error fetching document-type for ${uid} (${lang})`,
      err,
    });

    res
      .status(500)
      .json({ statusCode: 500, message: 'Something went wrong', error: err });

    return;
  }

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
    const ContentType = contentType.type;
    const { data: CMSData } = CMSContent || {};

    const { baseLangCategorisationMetadata } = CMSData ?? {};

    const baseLangMicrositeDoc =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE
        ? CMSContent?.data?.baseLangMicrositeData
        : CMSContent;

    const categoryHeaderMenuExists: boolean =
      checkIfCategoryHeaderExists({
        mbDesign: baseLangMicrositeDoc?.data?.design,
        mbType: baseLangCategorisationMetadata?.tagged_mb_type,
      }) && !!baseLangCategorisationMetadata?.tagged_city;

    const categoryHeaderMenuPromise = conditionalPromise(
      categoryHeaderMenuExists,
      () =>
        getCategoryHeaderMenu({
          doc: baseLangMicrositeDoc,
          lang: lang || DEFAULT_PRISMIC_LANG,
          ContentType,
        })
    );

    let listicleDocsPromise = Promise.resolve(
      {} as ReturnType<typeof getDocsForListicleSlice>
    );

    const shouldFetchListicle =
      ContentType === CUSTOM_TYPES.CONTENT_PAGE ||
      CMSContent?.data?.shoulder_page_type ===
        MB_CATEGORISATION.SHOULDER_PAGE_TYPE.SUB_ATTRACTIONS;

    if (shouldFetchListicle) {
      const { content_framework: contentFramework } = CMSData || {};
      const { data: contentFrameworkData } = contentFramework || {};
      const { body: slices } = contentFrameworkData || {};

      listicleDocsPromise = getDocsForListicleSlice({
        slices,
      });
    }

    const { categoryHeaderMenu, listicleDocs } = await labeledPromiseAllSettled(
      [
        {
          promise: listicleDocsPromise,
          label: 'listicleDocs',
        },
        {
          promise: categoryHeaderMenuPromise,
          label: 'categoryHeaderMenu',
        },
      ] as const
    );

    const { collectionIdsInListicles, docsForListicles } = listicleDocs || {};

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
      ContentType,
      categoryHeaderMenu: categoryHeaderMenu || {},
      collectionIdsInListicles,
      docsForListicles,
      shouldPageHaveShorterTtl,
      prismicDocumentTypeApiCacheStatus: `${cacheHeader}, Age: ${
        cacheAge ?? -1
      }`,
    });
  }
};

export default getPrismicDocumentData;
