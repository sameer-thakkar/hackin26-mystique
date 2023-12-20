import { handleSettledPromiseResults } from 'utils';
import { constructHeaders } from 'utils/apiUtils';
import { sendLog } from 'utils/logger';
import { traceError } from 'utils/logutils';
import getContentPageDocument from 'utils/prismicUtils/contentPage';
import getGlobalCity from 'utils/prismicUtils/globalCity';
import getGlobalCollection from 'utils/prismicUtils/globalCollection';
import getGlobalExperience from 'utils/prismicUtils/globalExperience';
import getGlobalHomepage from 'utils/prismicUtils/globalHomepage';
import getMicrositeDocument from 'utils/prismicUtils/microsite';
import { getNewsPageDocument } from 'utils/prismicUtils/NewsPage';
import getShowPage from 'utils/prismicUtils/showPage';
import getVenuePageDocument from 'utils/prismicUtils/venuePage';
import { MICROBRANDS_URL, X_CACHE_HEADER_KEY } from 'const/index';
import type { TDocumentResponse, TGetPrismicDocument } from './interface';

type TGetPrismicDocumentResponse<T> = Promise<TDocumentResponse<T>>;

export const getPrismicDocument = async ({
  req,
  isDev,
  lang,
  uid,
}: TGetPrismicDocument): TGetPrismicDocumentResponse<any> => {
  const { host } = req.headers || window.location;
  let promises = [
    getGlobalHomepage({ req, lang, uid }),
    getGlobalExperience({ req, lang, uid }),
    getGlobalCollection({ req, lang, uid }),
    getGlobalCity({ req, lang, uid }),
    getMicrositeDocument({
      req,
      host,
      lang,
      uid,
    }),
    getNewsPageDocument({ req, lang, uid }),
    getVenuePageDocument({ req, lang, uid }),
    getContentPageDocument({
      req,
      host,
      lang,
      uid,
    }),
    getShowPage({
      req,
      lang,
      uid,
      isDev,
      host,
    }),
  ];

  try {
    const settledPromises = await Promise.allSettled(promises);
    const [settledResult] = handleSettledPromiseResults(settledPromises) ?? [];
    if (settledResult) {
      return settledResult;
    } else {
      throw new Error('No document found!');
    }
  } catch (error) {
    if ((error as any).errors && Array.isArray((error as any).errors)) {
      (error as any).errors.forEach((errorInstance: any) => {
        // eslint-disable-next-line no-console
        console.error(errorInstance);
      });
    }
    /**
     * Sentry quota due to the following line has exceeded the daily limit.
     * Blocking posting to sentry until all the issues are reduced to a significant limit.
     * Uncomment below line to resume posting parsing errors.
     *
     * Sentry Aggregate Errors:
     * https://sentry.io/organizations/headout/issues/3767199315/events/79cc53c79eb64cb0af310861962cffde/events/?cursor=0%3A50%3A0&project=1545593
     *
     * Sentry.captureException(error);
     */
    sendLog({
      err: error,
      message: {
        host: req?.headers?.host,
        url: req?.url,
        message: 'Prismic Doc Not Found',
      },
    });
    traceError({
      error,
      host: req?.headers?.host,
      url: req?.url,
      message: 'Prismic Doc Not Found',
    });
    return {
      statusCode: 404,
    };
  }
};

type TFetchPrismicDocument = Omit<TGetPrismicDocument, 'ref'> & {
  host: string;
  bypassCache: string;
};

type TFetchPrismicDocumentResponse = Promise<{
  prismicApiCacheStatus: string | null;
  prismicApiResponse: Omit<TDocumentResponse<any>, 'shouldHaveShorterTtl'> & {
    shouldPageHaveShorterTtl?: boolean;
  };
}>;

export const fetchPrismicDocument = async ({
  req,
  host,
  uid,
  lang,
  isDev,
  bypassCache,
}: TFetchPrismicDocument): TFetchPrismicDocumentResponse => {
  const { headers, cookies } = req;
  const requestHeaders = constructHeaders({ cookies, currentHeaders: headers });

  const params = new URLSearchParams({
    isDev: String(isDev),
  });

  // header to release canary
  requestHeaders.set('x-canary', '0');

  // Bypass prismic api cache.
  if (bypassCache) {
    params.append('bypassCache', bypassCache);
  }

  params.sort();
  const paramsString = params.toString();

  const domain = isDev ? `http://${host}` : MICROBRANDS_URL;
  const endpoint = `${domain}/api/prismic/${uid}/${lang}/?${paramsString}`;

  const response = (await fetch(endpoint, {
    headers: requestHeaders,
  })) || { statusCode: 404 };

  const cacheHeader = response.headers.get(X_CACHE_HEADER_KEY);
  const cacheAge = response.headers.get('age');
  const data = await response.json();

  return {
    prismicApiResponse: data,
    prismicApiCacheStatus: `${cacheHeader}, Age: ${cacheAge ?? -1}`,
  };
};
