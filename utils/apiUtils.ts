import type { NumberField } from '@prismicio/types';
import type { IncomingHttpHeaders } from 'http2';
import Cookies from 'js-cookie';
import { EReviewRatingFilter, EReviewSortType } from 'types/reviews';
import {
  convertHttpHeadersToRegularHeaders,
  getHeadoutLanguagecode,
} from 'utils';
import { sortDateArray } from 'utils/dateUtils';
import { currencySortFn, isServer } from 'utils/gen';
import { addQueryParams, getDomainFromUid } from 'utils/urlUtils';
import {
  AUTOMATED_PRODUCT_RANKING_FILTER,
  AUTOMATED_PRODUCT_RANKING_VERSION,
  COOKIE,
  CUSTOM_HEADER,
  MICROBRANDS_URL,
  QNA_EXP_UIDS,
} from 'const/index';
import { LOG_LEVELS } from 'const/logs';
import { withTrailingSlash } from './helper';
import { simplifySlotData } from './inventoryUtils';
import { sendLog } from './logger';

type TTgids = string[];
type THost = string;

const objectToQuery = (query: any) => {
  const params = Object.entries(query);
  return params.length
    ? '?' +
        Object.entries(query)
          .filter(([, val]) => !!val)
          .map(([key, val]) => `${key}=${val}`)
          .join('&')
    : '';
};

export const swrFetcher = async (url: string) => {
  const cookies = Cookies.get();
  const headers = constructHeaders({ cookies });
  const res = await fetch(url, { headers });
  return res.json();
};

export const constructHeaders = ({
  cookies = {},
  currentHeaders = {},
}: {
  cookies?: Partial<{ [key: string]: string }>;
  currentHeaders?: IncomingHttpHeaders;
}) => {
  const headers = convertHttpHeadersToRegularHeaders(currentHeaders);

  if (cookies[COOKIE.CURRENT_CHANNEL]?.length) {
    headers.set('x-channel', cookies[COOKIE.CURRENT_CHANNEL] as string);
  }

  if (cookies)
    headers.set(
      'cookie',
      Object.entries(cookies ?? {}).reduce(
        (acc, [key, value]) => `${acc}${key}=${value};`,
        ''
      )
    );
  /**
   * Added to whitelist API calls originating from server on WAF.
   *
   * TODO: Maintain a list of allowed headers if the following works out :wink.
   */
  if (isServer()) {
    headers.set('x-api-key', process.env?.WAF_API_WHITELIST_TOKEN || '');
    headers.delete('content-length');
  }

  return headers;
};

/**
 * Use this if you need to use Promise.all with swr. It takes an array of URLs and returns an array of fetched data
 * Note this will create a cache key with the array of all of them and it will revalidate all of them at the same time. If you want more granular control you will need to use more than one useSWR call.
 * @param urls - An array of URLs to fetch.
 * @returns An array of promises.
 */
export const swrMultiFetcher = (...urls: string[]) => {
  return Promise.all(urls.map((url) => swrFetcher(url)));
};

export enum HeadoutEndpoints {
  TourGroupsV6,
  TourGroupInventoriesV6,
  TourGroupInventoriesV7,
  BulkTourGroupInventories,
  TourGroupSlotsV6,
  TourGroupListByCollectionV6,
  TourGroupListByCategoryV6,
  TourGroupListBySubCategoryV6,
  TourGroupReviewsV2,
  TourGroupReviewMedias,
  Collection,
  CollectionProductCards,
  CollectionSections,
  CollectionTop,
  CollectionReviews,
  Category,
  CategoryReviews,
  SubCategoryReviews,
  CurrencyList,
  CalendarInventory,
  CityListV2,
  DomainConfig,
  ProductV6,
  Banners,
  CalendarInventoryForTourGroupList,
  NearbyCityList,
  Media,
  Airports,
  CollectionPoi,
  BulkPoiList,
  ItinerariesByTGID,
  BulkExperienceItineraries,
  CollectionTourGroups,
  GeoLocateCity,
  BulkItineraries,
  GuestCount,
  QnaSections,
  TourGroupReviewsV6,
  CityInfo,
  PinnedReviewsByTgid,
  PinnedReviewsByTgidList,
}

const endPointsOnNewCDN = [
  HeadoutEndpoints.TourGroupsV6,
  HeadoutEndpoints.TourGroupListByCollectionV6,
  HeadoutEndpoints.CollectionSections,
  HeadoutEndpoints.TourGroupListByCategoryV6,
  HeadoutEndpoints.TourGroupListBySubCategoryV6,
  HeadoutEndpoints.TourGroupReviewsV2,
  HeadoutEndpoints.CityListV2,
  HeadoutEndpoints.CollectionTourGroups,
  HeadoutEndpoints.CollectionProductCards,
  HeadoutEndpoints.BulkExperienceItineraries,
  HeadoutEndpoints.ItinerariesByTGID,
  HeadoutEndpoints.BulkPoiList,
  HeadoutEndpoints.CollectionPoi,
  HeadoutEndpoints.CollectionReviews,
  HeadoutEndpoints.CategoryReviews,
  HeadoutEndpoints.SubCategoryReviews,
  HeadoutEndpoints.Media,
  HeadoutEndpoints.NearbyCityList,
  HeadoutEndpoints.Banners,
  HeadoutEndpoints.DomainConfig,
  HeadoutEndpoints.CurrencyList,
  HeadoutEndpoints.Category,
  HeadoutEndpoints.CollectionTop,
  HeadoutEndpoints.TourGroupReviewMedias,
  HeadoutEndpoints.Collection,
  HeadoutEndpoints.GeoLocateCity,
  HeadoutEndpoints.QnaSections,
  HeadoutEndpoints.TourGroupReviewsV6,
  HeadoutEndpoints.CityInfo,
  HeadoutEndpoints.PinnedReviewsByTgid,
  HeadoutEndpoints.PinnedReviewsByTgidList,
];

export const getHeadoutApiUrl = ({
  endpoint,
  hostname,
  params,
  id,
}: {
  endpoint: HeadoutEndpoints;
  hostname?: THost;
  params?: { [_key: string]: string };
  id?: string | number | null;
  urlParams?: { [_key: string]: string };
}) => {
  let endpointSlug;

  switch (endpoint) {
    case HeadoutEndpoints.TourGroupsV6:
      endpointSlug = `/api/tours/v6/tour-groups/${id ? `${id}/` : ''}`;
      break;
    case HeadoutEndpoints.TourGroupInventoriesV6:
      endpointSlug = `/api/tours/v6/tour-groups/${id}/inventories/`;
      break;
    case HeadoutEndpoints.TourGroupInventoriesV7:
      endpointSlug = `/api/v7/tour-groups/${id}/inventories/`;
      break;
    case HeadoutEndpoints.BulkTourGroupInventories:
      endpointSlug = `/api/v7/tour-groups/inventories`;
      break;
    case HeadoutEndpoints.TourGroupSlotsV6:
      endpointSlug = `/api/tours/v6/tour-groups/slots/get/${id}`;
      break;
    case HeadoutEndpoints.TourGroupListByCollectionV6:
      endpointSlug = `/api/tours/v6/tour-groups/list-by/collection/${id}`;
      break;
    case HeadoutEndpoints.TourGroupListByCategoryV6:
      endpointSlug = `/api/tours/v6/tour-groups/list-by/category/${id}/`;
      break;
    case HeadoutEndpoints.TourGroupListBySubCategoryV6:
      endpointSlug = `/api/tours/v6/tour-groups/list-by/sub-category/${id}/`;
      break;
    case HeadoutEndpoints.TourGroupReviewsV2:
      endpointSlug = `/api/tours/v2/review/tour-group/id/${id}/`;
      break;
    case HeadoutEndpoints.TourGroupReviewMedias:
      endpointSlug = `/api/v6/tour-groups/${id}/review-medias`;
      break;
    case HeadoutEndpoints.Collection:
      endpointSlug = `/api/tours/v1/collection/`;
      break;
    case HeadoutEndpoints.CollectionSections:
      endpointSlug = `/api/tours/v1/collection/${id}/sections/`;
      break;
    case HeadoutEndpoints.CollectionTop:
      endpointSlug = `/api/v1/collection/top/list/`;
      break;
    case HeadoutEndpoints.Category:
      endpointSlug = `/api/v2/category/`;
      break;
    case HeadoutEndpoints.CurrencyList:
      endpointSlug = `/api/v1/currency/list/`;
      break;
    case HeadoutEndpoints.CalendarInventory:
      endpointSlug = `/api/v7/tour-groups/${id}/calendar/`;
      break;
    case HeadoutEndpoints.DomainConfig:
      endpointSlug = `/api/domain/`;
      break;
    case HeadoutEndpoints.ProductV6:
      endpointSlug = `https://api-mb.headout.com/api/v6/tour-groups/${id}/`;
      break;
    case HeadoutEndpoints.Banners:
      endpointSlug = `/api/v2/banners/`;
      break;
    case HeadoutEndpoints.CalendarInventoryForTourGroupList:
      endpointSlug = `/api/v7/tour-groups/calendar/`;
      break;
    case HeadoutEndpoints.NearbyCityList:
      endpointSlug = `/api/v2/city/${id}/nearby-cities`;
      break;
    case HeadoutEndpoints.Media:
      endpointSlug = `/api/v1/media/`;
      break;
    case HeadoutEndpoints.CollectionReviews:
      endpointSlug = `/api/v2/collections/${id}/reviews`;
      break;
    case HeadoutEndpoints.CategoryReviews:
      endpointSlug = `/api/v3/cities/${params?.cityId}/categories/${id}/reviews`;
      break;
    case HeadoutEndpoints.SubCategoryReviews:
      endpointSlug = `/api/v3/cities/${params?.cityId}/subcategories/${id}/reviews`;
      break;
    case HeadoutEndpoints.Airports:
      endpointSlug = '/api/v1/airport-transfers/fetch-airports';
      break;
    case HeadoutEndpoints.CollectionPoi:
      endpointSlug = `/api/v1/collection/${id}/pois`;
      break;
    case HeadoutEndpoints.BulkPoiList:
      endpointSlug = `/api/v1/pois`;
      break;
    case HeadoutEndpoints.ItinerariesByTGID:
      endpointSlug = `/api/v6/tour-groups/${id}/experience-itineraries/`;
      break;
    case HeadoutEndpoints.BulkExperienceItineraries:
      endpointSlug = '/api/tours/v1/experience-itineraries/';
      break;
    case HeadoutEndpoints.CollectionTourGroups:
      endpointSlug = `/api/tours/v1/collection/${id}/tour-groups/`;
      break;
    case HeadoutEndpoints.CollectionProductCards:
      endpointSlug = `/api/v2/collections/${id}/product-cards/`;
      break;
    case HeadoutEndpoints.CityListV2:
      endpointSlug = `/api/tours/v2/city/list`;
      break;
    case HeadoutEndpoints.BulkItineraries:
      endpointSlug = `/api/v1/experience-itineraries/`;
      break;
    case HeadoutEndpoints.GeoLocateCity:
      endpointSlug = `/api/tours/v2/geolocate/city`;
      break;
    case HeadoutEndpoints.QnaSections:
      endpointSlug = `/api/v2/collections/${id}/qna/sections/`;
      break;
    case HeadoutEndpoints.GuestCount:
      endpointSlug = `/api/v1/guest-count/`;
      break;
    case HeadoutEndpoints.TourGroupReviewsV6:
      endpointSlug = `/api/v6/tour-groups/${id}/reviews/`;
      break;
    case HeadoutEndpoints.CityInfo:
      endpointSlug = `/api/tours/v3/cities/${id}/`;
      break;
    case HeadoutEndpoints.PinnedReviewsByTgid:
      endpointSlug = `/api/tours/v6/tour-groups/${id}/pinned-reviews/`;
      break;
    case HeadoutEndpoints.PinnedReviewsByTgidList:
      endpointSlug = `/api/v6/tour-groups/pinned-reviews/`;
      break;
  }

  const shouldPointToNewCDN = endPointsOnNewCDN.includes(endpoint);

  /**
   * This tells us whether we will be directly calling calipso
   * or whether we will be calling it behind a proxy nextjs api call
   */
  const isProxyCall = endpointSlug.includes('/tours/') && !!hostname;

  let url: string;

  if (hostname) {
    url = withTrailingSlash(`${hostname}${endpointSlug}`);
  } else {
    const formattedEndpointSlug = endpointSlug.replace('/tours/', '/');

    /**
     * NOTE:
     * Ensure that all API endpoints are ending with a trailing slash "/"
     * This is being done to prevent creating duplicate reads on CDN.
     */
    url = withTrailingSlash(
      `https://${
        shouldPointToNewCDN ? 'api-mb' : 'api'
      }.headout.com${formattedEndpointSlug}`
    );
  }

  /**
   * newCDN param should only be added if it is a proxy call
   *
   * newCDN tells the nextjs API route to call api-mb.headout.com
   * instead of api.headout.com
   */
  const shouldAddNewCDNQueryParam = shouldPointToNewCDN && isProxyCall;

  const finalParams = {
    ...(shouldAddNewCDNQueryParam && { newCDN: 'true' }),
    ...(params && params),
  };

  const finalUrl = (
    finalParams && Object.keys(finalParams).length
      ? addQueryParams(url, finalParams)
      : url
  ) as string;

  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development' && isProxyCall) {
    return finalUrl.replace('https://', 'http://');
  }

  return finalUrl;
};

export const fetchTourList = ({
  tgids,
  host = '',
  ...query
}: Record<string, any>) => {
  const headers = constructHeaders({});

  return fetch(
    `${host ? host : ''}/api/tours/v6/tour-groups/${objectToQuery({
      'ids%5B%5D': tgids,
      ...query,
    })}`,
    {
      headers,
    }
  );
};

interface CommonApiProps {
  hostname?: string;
  language?: string;
  fallbackToEnglish?: boolean;
  currency?: string;
  useTest?: boolean;
  cookies?: { [key: string]: string };
}

interface TourListProps extends CommonApiProps {
  tgids: string[] | number[];
  currency?: string;
}

interface TourListMediaProps extends CommonApiProps {
  tgids: string[] | number[] | (string | number)[];
  resourceType: string;
}

interface ExperienceItinerariesProps extends CommonApiProps {
  tgids: string[] | number[] | (string | number)[];
  sections?: boolean;
}

interface CollectionReviewsProps extends CommonApiProps {
  collectionId: number;
  limit?: string;
  offset?: string;
  language?: string;
}

interface CategoryReviewsProps extends CommonApiProps {
  categoryId: number;
  cityId: string;
  limit?: string;
  offset?: string;
  language?: string;
}

interface SubCategoryReviewsProps extends CommonApiProps {
  subCategoryId: number;
  limit?: string;
  offset?: string;
  language?: string;
  cityId: string;
}

export const fetchTourGroupMedia = async ({
  tgids,
  cookies = {},
  resourceType,
}: TourListMediaProps) => {
  try {
    const params = {
      'resource-entity-ids': tgids?.join(','),
      'resource-type': resourceType,
    };
    const apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.Media,
      params,
      id: null,
    });
    if (!tgids.join(',')) {
      sendLog({
        level: LOG_LEVELS.ERROR,
        message: `[fetchTourGroupMedia] tgids is required - ${tgids.join(',')}`,
      });
    }

    const headers = constructHeaders({ cookies });

    const res = await fetch(apiUrl, { headers });
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTourGroupMedia]', error);
    sendLog({
      err: error,
    });
  }
};

export const fetchExperienceItineraries = async ({
  tgids,
  sections = true,
  cookies = {},
  language = 'EN',
}: ExperienceItinerariesProps) => {
  try {
    const params = {
      ids: tgids?.join(','),
      language: language?.toUpperCase(),
      sections: String(sections),
    };
    const apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.BulkExperienceItineraries,
      params,
    });
    const headers = constructHeaders({ cookies });

    const res = await fetch(apiUrl, { headers });

    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchExperienceItineraries]', error);
    sendLog({
      err: error,
    });
  }
};

export const fetchCollectionReviews = async ({
  collectionId,
  cookies = {},
  limit = '8',
  offset = '0',
  language = 'EN',
}: CollectionReviewsProps) => {
  try {
    const params = {
      limit,
      offset,
      language,
    };
    const apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.CollectionReviews,
      params,
      id: collectionId,
    });
    const headers = constructHeaders({ cookies });
    const res = await fetch(apiUrl, { headers });
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCollectionReviews]', error);
    sendLog({
      err: error,
    });
  }
};

export const fetchCategoryReviews = async ({
  categoryId,
  cookies = {},
  limit = '8',
  offset = '0',
  language = 'EN',
  cityId,
}: CategoryReviewsProps) => {
  try {
    const params = {
      limit,
      offset,
      language,
      cityId,
    };
    let apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.CategoryReviews,
      params,
      id: categoryId,
    });
    // This is done due to limitations with passing multiple params to getHeadoutApiUrl in this case: id and cityId
    // removed the cityId here to avoid passing extra query params to BE
    apiUrl = apiUrl.replace(/&cityId=[^&]*/, '');
    const headers = constructHeaders({ cookies });
    const res = await fetch(apiUrl, { headers });
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCategoryReviews]', error);
    sendLog({
      err: error,
    });
  }
};

export const fetchSubCategoryReviews = async ({
  subCategoryId,
  cookies = {},
  limit = '8',
  offset = '0',
  language = 'EN',
  cityId,
}: SubCategoryReviewsProps) => {
  try {
    const params = {
      limit,
      offset,
      language,
      cityId,
    };
    let apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.SubCategoryReviews,
      params,
      id: subCategoryId,
    });
    // This is done due to limitations with passing multiple params to getHeadoutApiUrl in this case: id and cityId
    // removed the cityId here to avoid passing extra query params to BE
    apiUrl = apiUrl.replace(/&cityId=[^&]*/, '');
    const headers = constructHeaders({ cookies });
    const res = await fetch(apiUrl, { headers });
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchSubCategoryReviews]', error);
    sendLog({
      err: error,
    });
  }
};

export const fetchTourListV6 = async ({
  hostname,
  language,
  tgids,
  fallbackToEnglish = false,
  currency,
  useTest,
  cookies = {},
}: TourListProps) => {
  try {
    if (!tgids?.length) return {};

    const params = {
      'ids[]': tgids?.join(','),
      ...(language && { language }),
      ...(currency && { currency }),
      ...(useTest && { useTest: 'true' }),
      ...(!fallbackToEnglish &&
        language !== 'en' && {
          'fallback-to-english': '0',
        }),
    };
    const apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.TourGroupsV6,
      hostname,
      params,
      id: null,
    });
    const headers = constructHeaders({ cookies });
    const res = await fetch(apiUrl, { headers });
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTourListV6]', error);
    sendLog({
      err: error,
    });
  }
};

interface FetchMediaProps extends CommonApiProps {
  currency?: string;
  resourceType: string;
  entityIds: string;
}
interface FetchMediaResponse {
  resourceType: string;
  resourceEntityMedias: Array<{
    resourceEntityId: string;
    medias: Array<{
      url: string;
      type: string;
      metadata: {
        altText: string;
        height: number;
        width: number;
        videoDuration: any;
        uploadDate: string;
        filename: string;
        fileSize: number;
      };
      info: {
        sourceType: string;
        sourceUrl: string;
        credit: string;
        filename: string;
        fileSize: number;
      };
    }>;
  }>;
}
export const fetchMediaResource = async ({
  hostname,
  cookies = {},
  resourceType,
  entityIds = '',
}: FetchMediaProps) => {
  try {
    // NOTE: Doing this to get unique TGID.
    const uniqueTgidString = entityIds?.length
      ? [...new Set(entityIds.split(','))].join(',')
      : null;

    const params = {
      ...(resourceType && {
        'resource-type': resourceType,
      }),
      ...(uniqueTgidString && {
        'resource-entity-ids': uniqueTgidString,
      }),
    };

    if (!uniqueTgidString) {
      sendLog({
        level: LOG_LEVELS.ERROR,
        message: `[fetchMediaResource] entityIds is required - ${hostname} - ${entityIds}`,
      });
      return {} as FetchMediaResponse;
    }

    const apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.Media,
      hostname,
      params,
      id: null,
    });

    const headers = constructHeaders({ cookies });

    const res = await fetch(apiUrl, { headers });
    return (await res.json()) as FetchMediaResponse;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchMedia]', error);
  }
};

interface TFetchReviewMediasTypes extends CommonApiProps {
  tgid: string | number;
  language?: string;
  limit?: number;
  offset?: number;
}

export interface TReviewMediasResponse {
  items: Array<{
    id: number;
    nonCustomerName: string;
    reviewerImgUrl?: string;
    rating: number;
    content: string;
    reviewTime: number;
    reviewMedias: Array<{
      url: string;
      fileType: string;
      fileSize: number;
      width: any;
      height: any;
      fileName: string;
    }>;
    translatedContent?: string;
    useTranslatedContent: boolean;
    nonCustomerCountryCode: any;
    sourceLanguage: string;
    nonCustomerCountryName: any;
    source: 'CUSTOMER' | 'TOURLANDISH' | 'PARTNER';
  }>;
  nextUrl: string;
  prevUrl: string;
  total: number;
  nextOffset: number;
  prevOffset: number;
}

export const fetchReviewMedias = async ({
  tgid,
  language = 'EN',
  limit,
  hostname,
  offset,
  cookies = {},
}: TFetchReviewMediasTypes) => {
  try {
    const params = {
      ...(language && {
        language,
      }),
      ...(limit && {
        limit: limit.toString(),
      }),
      ...(offset && {
        offset: offset.toString(),
      }),
    };
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.TourGroupReviewMedias,
      id: tgid,
      params,
      hostname,
    });
    const headers = constructHeaders({ cookies });
    const response = await fetch(url, { headers });
    const data = (await response.json()) as TReviewMediasResponse;
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[fetchRevieMedias]', error);
  }
};

interface TourGroupProps extends CommonApiProps {
  tgid: string | number;
}

export const fetchTourGroupV6 = async ({
  tgid,
  hostname,
  language,
  currency,
  cookies,
}: TourGroupProps) => {
  const params = {
    ...(language && { language }),
    ...(currency && { currency }),
  };
  const headers = constructHeaders({ cookies });

  const apiUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    hostname,
    params,
    id: tgid,
  });
  if (!tgid) {
    sendLog({
      level: LOG_LEVELS.ERROR,
      message: `[fetchTourGroupV6] tgid is required - ${tgid}`,
    });
  }

  const res = await fetch(apiUrl, { headers });
  return await res.json();
};

export const fetchCurrencyList = async () => {
  try {
    const endpoint = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.CurrencyList,
      id: null,
    });
    const res = await fetch(endpoint);
    const data = await res.json();

    return data?.sort(currencySortFn);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCurrencyList]', error);
  }
};

interface IFetchTourGroupsByCollectionProps extends CommonApiProps {
  collectionId: string | number;
  limit?: string;
  primarySubCategoryID?: NumberField | string;
  useAutomatedRankings?: boolean;
  includeHidden?: boolean;
}

interface fetchTourGroupsByCategoryProps extends CommonApiProps {
  categoryId: string | number;
  isSubCategory: boolean;
  city?: string;
  limit?: string;
  primarySubCategoryID?: NumberField;
}

export const fetchProductData = async ({
  id,
  lang,
  hostname,
  currency,
  cookies,
}: any) => {
  const params = {
    language: lang,
    'use-seatmap-prices': 'false',
    'fetch-collection-svg': 'false',
    'fetch-all-listing-prices': '1',
    'include-unavailable': 'true',
    ...(currency && { currency }),
  };
  const headers = constructHeaders({ cookies: cookies ?? {} });
  const url = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    hostname,
    id,
    params,
  });
  if (!id) {
    sendLog({
      level: LOG_LEVELS.ERROR,
      message: `[fetchProductData] id is required - ${id}`,
    });
  }
  try {
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const response = await fetch(url, headers);
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const fetchTourGroupsByCollection = async ({
  collectionId,
  hostname,
  language = 'en',
  limit,
  fallbackToEnglish = false,
  currency,
  cookies,
  primarySubCategoryID,
  useAutomatedRankings = false,
  includeHidden = false,
}: IFetchTourGroupsByCollectionProps) => {
  const params = {
    language,
    'use-seatmap-prices': '1',
    ...(limit && { limit }),
    ...(currency && { currency }),
    ...(!fallbackToEnglish &&
      language !== 'en' && {
        'fallback-to-english': '0',
      }),
    ...(primarySubCategoryID && {
      'filter-by-subcategory-ids': String(primarySubCategoryID),
    }),
    ...(useAutomatedRankings && {
      'src-version': 'v3',
    }),
    ...(includeHidden && {
      'include-hidden': String(includeHidden),
    }),
  };

  const headers = constructHeaders({ cookies });
  const url = getHeadoutApiUrl({
    endpoint: useAutomatedRankings
      ? HeadoutEndpoints.CollectionTourGroups
      : HeadoutEndpoints.TourGroupListByCollectionV6,
    hostname,
    id: collectionId,
    params,
  });

  if (!collectionId) return {};

  try {
    const response = await fetch(url, { headers });
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTourGroupsByCollectionV1]', error);
  }
};

export const fetchTourGroupsByCategory = async ({
  categoryId,
  hostname,
  isSubCategory = false,
  city = '',
  language = 'en',
  limit,
  fallbackToEnglish = false,
  currency,
  cookies,
  primarySubCategoryID,
}: fetchTourGroupsByCategoryProps) => {
  const params = {
    language,
    'use-seatmap-prices': '1',
    ...(city && { city }),
    ...(limit && { limit }),
    ...(currency && { currency }),
    ...(!fallbackToEnglish &&
      language !== 'en' && {
        'fallback-to-english': '0',
      }),
    ...(primarySubCategoryID && {
      'filter-by-subcategory-id': String(primarySubCategoryID),
    }),
    'src-version': AUTOMATED_PRODUCT_RANKING_VERSION,
    'sort-type': AUTOMATED_PRODUCT_RANKING_FILTER.POPULARITY,
  };
  const headers = constructHeaders({ cookies });
  const url = getHeadoutApiUrl({
    endpoint: isSubCategory
      ? HeadoutEndpoints.TourGroupListBySubCategoryV6
      : HeadoutEndpoints.TourGroupListByCategoryV6,
    hostname,
    id: categoryId,
    params,
  });

  try {
    const response = await fetch(url, { headers });

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTGIDsByCategoryV2Obj]', error);
  }
};

interface FetchCollectionProps extends CommonApiProps {
  collectionId: string | number;
  limit?: string;
  useSeatmapPrices?: string;
  primarySubCategoryID?: string;
  enableSections?: boolean;
}
export const fetchCollection = async ({
  collectionId,
  hostname,
  language = 'en',
  limit,
  fallbackToEnglish = false,
  currency,
  useSeatmapPrices = '1',
  cookies = {},
  primarySubCategoryID,
  enableSections = false,
}: FetchCollectionProps) => {
  const params = {
    language,
    ...(limit && { limit }),
    ...(!fallbackToEnglish &&
      language !== 'en' && { 'fallback-to-english': '0' }),
    ...(currency && {
      currency,
    }),
    ...(useSeatmapPrices && { 'use-seatmap-prices': useSeatmapPrices }),
    ...(primarySubCategoryID && {
      'filter-by-subcategory-id': primarySubCategoryID,
    }),
    ...(enableSections && { 'include-carousel-sections': 'true' }),
  };
  const finalUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CollectionSections,
    hostname,
    params,
    id: collectionId,
  });

  const headers = constructHeaders({ cookies });
  try {
    const response = await fetch(finalUrl, {
      headers,
    });
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCollection]', error);
  }
};

interface FetchCollectionListProps
  extends Omit<CommonApiProps, 'fallbackToEnglish'> {
  collectionIds: number[];
}

export const fetchCollectionList = async ({
  collectionIds,
  hostname,
  currency,
  language,
  cookies,
}: FetchCollectionListProps) => {
  const params = {
    'ids[]': collectionIds?.join(','),
    language,
    ...(currency && {
      currency,
    }),
  };
  const finalUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.Collection,
    hostname,
    // @ts-expect-error TS(2322): Type '{ currency?: string | undefined; 'ids[]': st... Remove this comment to see the full error message
    params,
    id: null,
  });
  const headers = constructHeaders({ cookies });
  try {
    const response = await fetch(finalUrl, { headers });

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCollectionList]', error);
  }
};

interface FetchCollectionTopProps
  extends Omit<CommonApiProps, 'fallbackToEnglish'> {
  city?: string;
  categoryId?: string | number;
  subCategoryId?: string | number;
  limit?: string | number;
  offset?: string | number;
  useSeatmapPrices?: string;
}
export const fetchCollectionTop = async ({
  city,
  categoryId,
  subCategoryId,
  hostname,
  limit,
  offset,
  currency,
  language = 'en',
  useSeatmapPrices = '1',
  cookies = {},
}: FetchCollectionTopProps) => {
  const params = {
    ...(city && { city }),
    ...(categoryId && { categoryId: categoryId.toString() }),
    ...(subCategoryId && { subCategoryId: subCategoryId.toString() }),
    language,
    ...(limit && { limit: limit.toString() }),
    ...(offset && { limit: offset.toString() }),
    ...(currency && {
      currency,
    }),
    ...(useSeatmapPrices && { 'use-seatmap-prices': useSeatmapPrices }),
  };
  const finalUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CollectionTop,
    hostname,
    params,
    id: null,
  });

  const headers = constructHeaders({ cookies });
  try {
    const response = await fetch(finalUrl, {
      headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCollectionTop]', error);
  }
};

type FetchCategoryProps = {
  city?: string;
  language?: string;
  filterCategoryActiveProductCount?: number;
  includeUnavailable?: boolean;
  includeHidden?: boolean;
  hostname?: string;
  cookies?: { [key: string]: string };
};
export const fetchCategory = async ({
  city,
  hostname,
  language = 'en',
  filterCategoryActiveProductCount = 1,
  includeUnavailable = false,
  includeHidden = false,
  cookies = {},
}: FetchCategoryProps) => {
  const params = {
    ...(city && { city }),
    language,
    ...(filterCategoryActiveProductCount && {
      'filter-category-active-product-count':
        filterCategoryActiveProductCount.toString(),
    }),
    ...(includeUnavailable && {
      'include-unavailable': includeUnavailable.toString(),
    }),
    ...(includeHidden && { 'include-hidden': includeHidden.toString() }),
  };
  const finalUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.Category,
    hostname,
    params,
    id: null,
  });
  const headers = constructHeaders({ cookies });
  try {
    const response = await fetch(finalUrl, {
      headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    sendLog({ err: error });
  }
};

export const fetchTourGroupReviewsV6 = async ({
  tgid,
  limit = 10,
  offset = 0,
  sortType = EReviewSortType.MOST_RELEVANT,
  ratingFilter = null,
  hasMediaFilter = true,
  language = 'EN',
  hostname,
}: {
  tgid: string | number;
  limit?: number;
  offset?: number;
  sortType?: EReviewSortType;
  ratingFilter?: EReviewRatingFilter | null;
  hasMediaFilter?: boolean;
  language?: string;
  hostname?: string;
}) => {
  const params = {
    language,
    ...(limit && {
      limit: `${limit}`,
    }),
    ...(offset && {
      offset: `${offset}`,
    }),
    ...(ratingFilter && {
      'rating-filter': ratingFilter,
    }),
    ...(sortType && {
      'sort-type': sortType,
    }),
    ...(hasMediaFilter && {
      'media-filter': 'true',
    }),
  };

  const url = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupReviewsV6,
    id: tgid,
    params,
    hostname,
  });

  if (!tgid) {
    sendLog({
      level: LOG_LEVELS.ERROR,
      message: `[fetchTourGroupReviewsV6] -  tgid is required - ${tgid}`,
    });
  }

  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTourGroupReviewsV6]', error);
  }
};

export const fetchTourGroupReviews = async ({
  tgid,
  hostname,
  limit,
  filterType,
  sortType,
  sortOrder,
  offset,
  cookies,
  language = 'en',
}: {
  tgid: string | number;
  hostname?: string;
  filterType?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'TOP';
  sortType?: 'RATING' | 'HELPFULNESS' | 'CHRONOLOGICAL' | 'CONTENT_LENGTH';
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  cookies?: { [_key: string]: any };
  language?: string;
}) => {
  const params = {
    language,
    ...(limit && {
      limit: `${limit}`,
    }),
    ...(offset && {
      offset: `${offset}`,
    }),
    ...(filterType && {
      'filter-type': filterType,
    }),
    ...(sortType && {
      'sort-type': sortType,
    }),
    ...(sortOrder && {
      'sort-order': sortOrder,
    }),
  };
  const url = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupReviewsV2,
    id: tgid,
    hostname,
    params,
  });
  if (!tgid) {
    sendLog({
      level: LOG_LEVELS.ERROR,
      message: `[fetchTourGroupReviews] -  tgid is required - ${tgid}`,
    });
  }

  try {
    const headers = constructHeaders({ cookies });
    const res = await fetch(url, { headers });
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTourGroupReviews]', error);
  }
};

export const fetchInventory = async ({
  tgid,
  hostname,
  minPax,
  forDays,
  useSeatmapPrices,
  language = 'en',
  variantId,
  currency,
  cookies,
}: {
  tgid: number | string;
  hostname: string;
  minPax?: number;
  forDays?: number;
  useSeatmapPrices?: boolean;
  language?: string;
  variantId?: number;
  currency?: string | null;
  cookies?: { [_key: string]: any };
}) => {
  try {
    const params = {
      ...(language && {
        language,
      }),
      ...(minPax && {
        'min-pax': `${minPax}`,
      }),
      ...(forDays && {
        'for-days': `${forDays}`,
      }),
      ...(useSeatmapPrices && {
        'use-seatmap-prices': `${useSeatmapPrices}`,
      }),
      ...(variantId && {
        variantId: `${variantId}`,
      }),
      ...(currency && {
        currency,
      }),
    };
    const headers = constructHeaders({ cookies });
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.TourGroupInventoriesV6,
      id: tgid,
      hostname,
      params,
    });
    const response = await fetch(url, { headers });

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchInventory]', error);
  }
};

export const fetchInventoryV7 = async ({
  tgid,
  minPax,
  fromDate,
  toDate,
  language = 'en',
  variantId,
  currency,
  cookies,
  useSeatmapPrices,
}: {
  tgid: number | string;
  hostname: string;
  minPax?: number;
  fromDate?: string;
  toDate?: string;
  language?: string;
  variantId?: number;
  currency?: string | null;
  cookies?: { [_key: string]: any };
  useSeatmapPrices?: boolean;
}) => {
  try {
    const params = {
      ...(language && {
        language,
      }),
      ...(minPax && {
        'min-pax': `${minPax}`,
      }),
      ...(fromDate && {
        'from-date': fromDate,
      }),
      ...(toDate && {
        'to-date': toDate,
      }),
      ...(variantId && {
        variantId: `${variantId}`,
      }),
      ...(currency && {
        currency,
      }),
      ...(useSeatmapPrices && {
        'use-seatmap-prices': `${useSeatmapPrices}`,
      }),
    };
    const headers = constructHeaders({ cookies });
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.TourGroupInventoriesV7,
      id: tgid,
      params,
    });
    const response = await fetch(url, { headers });

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchInventory]', error);
  }
};

export const fetchBulkInventories = async ({
  tgids,
  fromDate,
  toDate,
  language = 'en',
  variantId,
  currency,
  cookies,
  useSeatmapPrices,
}: {
  tgids: Array<number | string>;
  fromDate?: string;
  toDate?: string;
  language?: string;
  variantId?: number;
  currency?: string | null;
  cookies?: { [_key: string]: any };
  useSeatmapPrices?: boolean;
}) => {
  try {
    const params = {
      'tour-group-ids': tgids?.join(','),
      ...(language && {
        language,
      }),
      ...(fromDate && {
        'from-date': fromDate,
      }),
      ...(toDate && {
        'to-date': toDate,
      }),
      ...(variantId && {
        variantId: `${variantId}`,
      }),
      ...(currency && {
        currency,
      }),
      ...(useSeatmapPrices && {
        'use-seatmap-prices': `${useSeatmapPrices}`,
      }),
    };
    const headers = constructHeaders({ cookies });
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.BulkTourGroupInventories,
      params,
    });

    const response = await fetch(url, { headers });
    const data = await response.json();

    const inventory = Object.keys(data).reduce((acc, tgid) => {
      const { availabilities } = data[tgid] || {};
      return {
        ...acc,
        [tgid]: { availabilities },
      };
    }, {});

    return inventory;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchInventory]', error);
  }
};

export const fetchTourGroupSlots = async ({
  tgid,
  hostname,
  forDays,
  currency,
  cookies,
}: {
  tgid: string | number;
  hostname: string;
  forDays?: number;
  currency?: string;
  cookies?: { [_key: string]: any };
}) => {
  try {
    const params = {
      ...(forDays && {
        'for-days': `${forDays}`,
      }),
      ...(currency && {
        currency,
      }),
    };
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.TourGroupSlotsV6,
      id: tgid,
      hostname,
      params,
    });
    const headers = constructHeaders({ cookies });
    const response = await fetch(url, { headers });
    const data = await response.json();

    return simplifySlotData(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTourGroupSlots]', error);
  }
};

interface TFetchCalendarInventoryTypes {
  tgid: string | number;
  currency?: string | null;
  fromDate?: string;
  toDate?: string;
  variantId?: string | number;
  cookies?: { [key: string]: any };
}

export const fetchCalendarInventory = async ({
  tgid,
  currency,
  fromDate = '',
  toDate = '',
  variantId,
  cookies,
}: TFetchCalendarInventoryTypes) => {
  try {
    const params = {
      ...(fromDate && {
        'from-date': fromDate,
      }),
      ...(toDate && {
        'to-date': toDate,
      }),
      ...(variantId && {
        variantId: variantId?.toString(),
      }),
      ...(currency && {
        currency,
      }),
    };
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.CalendarInventory,
      id: tgid,
      params,
    });
    const headers = constructHeaders({ cookies });
    const response = await fetch(url, { headers });
    const data = await response.json();
    const { dates, metaData } = data ?? {};
    const sortedInventoryDates = sortDateArray(Object.keys(dates) ?? []);

    return { sortedInventoryDates, metaData, dates };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[fetchCalendarInventory]', error);
    throw error;
  }
};

export const fetchDomainConfig = async (uid: string) => {
  const url = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.DomainConfig,
    id: null,
  });

  const domainArray = getDomainFromUid(uid)?.split('.');

  if (domainArray && domainArray.length > 0) {
    domainArray[0] = 'book';
  }

  const whitelabel = `https://${domainArray?.join('.')}`;
  const customHeaders = constructHeaders({});

  customHeaders.append(CUSTOM_HEADER.ORIGIN, whitelabel);
  const requestOptions = {
    headers: customHeaders,
  };
  try {
    const response = await fetch(url, requestOptions);
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchDomainConfig]', error);
  }
};

interface TFetchBannerData {
  cookies?: { [key: string]: any };
  params: { [key: string]: any };
}

export const fetchBannerData = async ({
  cookies,
  params,
}: TFetchBannerData) => {
  const apiUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.Banners,
    params,
    id: '',
  });
  try {
    const headers = constructHeaders({ cookies });
    const response = await fetch(apiUrl, { headers });
    return await response.json();
  } catch (error) {
    sendLog({ err: error });
  }
};

interface TFetchCityTopCollections {
  cookies?: { [key: string]: any };
  params: { [key: string]: any };
}

export const fetchCityTopCollections = async ({
  cookies,
  params,
}: TFetchCityTopCollections) => {
  const apiUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CollectionTop,
    params,
    id: '',
  });
  try {
    const headers = constructHeaders({ cookies });
    const response = await fetch(apiUrl, { headers });
    return await response.json();
  } catch (error) {
    sendLog({ err: error });
  }
};

interface TFetchCityList extends TFetchCityTopCollections {
  cityCode: string;
}
export const fetchNearbyCityList = async ({
  cookies,
  params,
  cityCode,
}: TFetchCityList) => {
  const apiUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.NearbyCityList,
    params,
    id: cityCode,
  });
  try {
    const headers = constructHeaders({ cookies });
    const response = await fetch(apiUrl, { headers });
    return await response.json();
  } catch (error) {
    sendLog({ err: error });
  }
};

type TFetchBatchedCalendarInventory = {
  tgids: Array<string> | Array<number>;
  currency?: string;
  minPax?: number;
  fromDate: string;
  toDate: string;
  cookies?: Record<string, any>;
};

export const fetchBatchedCalendarInventory = async ({
  tgids,
  currency,
  minPax = 1,
  fromDate = '',
  toDate = '',
  cookies,
}: TFetchBatchedCalendarInventory) => {
  try {
    const params = {
      'tour-group-ids': tgids?.join(','),
      ...(fromDate && {
        'from-date': fromDate,
      }),
      ...(toDate && {
        'to-date': toDate,
      }),
      ...(currency && {
        currency,
      }),
      ...(minPax && {
        'min-pax': String(minPax),
      }),
    };
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.CalendarInventoryForTourGroupList,
      id: null,
      params,
    });
    const headers = constructHeaders({ cookies });
    const response = await fetch(url, { headers });
    const { data = {} } = (await response.json()) || {};

    const inventory = Object.keys(data).reduce((acc, tgid) => {
      const { dates, metadata } = data[tgid] || {};
      const sortedInventoryDates = sortDateArray(Object.keys(dates) || []);

      return {
        ...acc,
        [tgid]: { sortedInventoryDates, metadata, dates },
      };
    }, {});

    return inventory;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[fetchBatchedCalendarInventory]', error);
  }
};

type TFetchCollectionPoiInfo = {
  collectionId?: string | number;
  language?: string;
  cookies?: Record<string, any>;
};
export const fetchCollectionPoiInfo = async ({
  collectionId,
  language = 'en',
  cookies = {},
}: TFetchCollectionPoiInfo) => {
  try {
    if (!collectionId) return;
    const params = {
      language: getHeadoutLanguagecode(language),
      operatingSchedules: 'true',
      content: 'true',
      location: 'true',
    };
    const apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.CollectionPoi,
      params,
      id: String(collectionId),
    });
    const headers = constructHeaders({ cookies });
    const res = await fetch(apiUrl, { headers });

    const data = await res.json();
    return data?.pois?.[0];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCollectionPoiInfo]', error);
    sendLog({
      err: error,
    });
  }
};

type TFetchBulkPoisInfo = {
  poiIds?: (string | number)[];
  language?: string;
  cookies?: Record<string, any>;
  operatingSchedules?: boolean;
  content?: boolean;
  location?: boolean;
};
export const fetchBulkPoisInfo = async ({
  poiIds,
  language = 'en',
  cookies = {},
  operatingSchedules = false,
  content = false,
  location = false,
}: TFetchBulkPoisInfo) => {
  try {
    if (!poiIds?.length) return;

    const params = {
      language: getHeadoutLanguagecode(language),
      'ids[]': poiIds?.join(','),
      operatingSchedules: String(operatingSchedules),
      content: String(content),
      location: String(location),
    };
    const apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.BulkPoiList,
      params,
      id: null,
    });

    const headers = constructHeaders({ cookies });
    const res = await fetch(apiUrl, { headers });
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchBulkPoisInfo]', error);
    sendLog({
      err: error,
    });
  }
};

export const getPrismicProxyDomain = ({
  isDev,
  host,
}: {
  isDev: boolean;
  host: string;
}) =>
  isDev && process.env.NEXT_PUBLIC_USE_PRISMIC_FROM_CDN !== 'true'
    ? `http://${host}`
    : MICROBRANDS_URL;

export const getCatSubcatDescriptors = async ({
  descriptorsUid,
  lang,
  isDev,
  host,
}: {
  descriptorsUid: string;
  lang?: string | null;
  isDev: boolean;
  host: string;
}) => {
  const domain = getPrismicProxyDomain({ isDev, host });
  const endpoint = `${domain}/api/prismic/get-banner-descriptors/${descriptorsUid}/${lang}/`;

  try {
    const response = await fetch(endpoint);
    const bannerDescriptors = await response.json();
    return bannerDescriptors;
  } catch (error) {
    sendLog({
      err: error,
    });
    return {};
  }
};

export const getQnaData = async ({
  collectionId,
  uid,
}: {
  collectionId: string | number;
  uid: string;
}) => {
  try {
    const isUidPartOfQnaExp = QNA_EXP_UIDS.includes(uid);
    sendLog({
      level: LOG_LEVELS.INFO,
      message: `isUidPartOfQnaExp: ${isUidPartOfQnaExp}`,
    });

    if (!isUidPartOfQnaExp) {
      return {
        qnaSections: [],
      };
    }

    const qnaSectionsApiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.QnaSections,
      id: collectionId,
    });
    sendLog({
      level: LOG_LEVELS.INFO,
      message: `qnaSectionsApiUrl: ${qnaSectionsApiUrl}`,
    });

    const [qnaSectionsResponse] = await Promise.all([fetch(qnaSectionsApiUrl)]);

    const qnaSections = await qnaSectionsResponse.json();
    sendLog({
      level: LOG_LEVELS.INFO,
      message: `qnaSections: ${qnaSections}`,
    });
    return {
      qnaSections: qnaSections?.result ?? [],
    };
  } catch (error) {
    return {
      qnaSections: [],
    };
  }
};

interface IFetchCityInfoProps extends CommonApiProps {
  cityCode: string;
  language?: string;
}

export const fetchCityInfo = async ({
  cityCode,
  language = 'en',
  hostname,
}: IFetchCityInfoProps) => {
  if (!cityCode) {
    sendLog({
      level: LOG_LEVELS.ERROR,
      message: `[fetchCityInfo] cityCode is required - ${cityCode}`,
    });
    return null;
  }
  const cityInfoEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CityInfo,
    id: cityCode,
    params: {
      language,
    },
    hostname,
  });

  try {
    const res = await fetch(cityInfoEndpoint);
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCityInfo]', error);
    sendLog({
      err: error,
    });
  }
};

interface FetchRatingsProps extends CommonApiProps {
  uid: string;
}

export const fetchRatings = async ({
  uid,
  cookies = {},
}: FetchRatingsProps) => {
  try {
    if (!uid) {
      sendLog({
        level: LOG_LEVELS.ERROR,
        message: `[fetchRatings] uid is required - ${uid}`,
      });
      return null;
    }

    const url = `/api/ratings?uid=${encodeURIComponent(uid)}`;
    const headers = constructHeaders({ cookies });

    const response = await fetch(url, { headers });

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchRatings]', error);
    sendLog({
      err: error,
    });
    return null;
  }
};

interface FetchPinnedReviewsByTgidProps extends CommonApiProps {
  tgid: string;
}

export const fetchPinnedReviewsByTgid = async ({
  tgid,
  cookies = {},
  language = 'en',
  hostname,
}: FetchPinnedReviewsByTgidProps) => {
  try {
    if (!tgid) {
      sendLog({
        level: LOG_LEVELS.ERROR,
        message: `[fetchPinnedReviewsByTgid] tgid is required - ${tgid}`,
      });
      return null;
    }

    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.PinnedReviewsByTgid,
      id: tgid,
      params: {
        language,
      },
      hostname,
    });

    const headers = constructHeaders({ cookies });

    const response = await fetch(url, { headers });

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchPinnedReviewsByTgid]', error);
    sendLog({
      err: error,
    });
    return null;
  }
};

interface FetchPinnedReviewsByTgidListProps extends CommonApiProps {
  tgids: Array<string>;
}

export const fetchPinnedReviewsByTgidList = async ({
  tgids,
  cookies = {},
  language = 'en',
  hostname,
}: FetchPinnedReviewsByTgidListProps) => {
  try {
    if (!tgids) {
      sendLog({
        level: LOG_LEVELS.ERROR,
        message: `[fetchPinnedReviewsByTgidList] tgids is required - ${tgids}`,
      });
      return null;
    }

    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.PinnedReviewsByTgidList,
      params: {
        language,
        tourGroupIds: tgids.join(','),
      },
      hostname,
    });

    const headers = constructHeaders({ cookies });

    const response = await fetch(url, { headers });

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchPinnedReviewsByTgidList]', error);
    sendLog({
      err: error,
    });
    return null;
  }
};
