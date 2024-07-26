import type { NumberField } from '@prismicio/types';
import type { IncomingHttpHeaders } from 'http2';
import {
  convertHttpHeadersToRegularHeaders,
  getHeadoutLanguagecode,
} from 'utils';
import { sortDateArray } from 'utils/dateUtils';
import { currencySortFn, isServer } from 'utils/gen';
import { addQueryParams, getDomainFromUid } from 'utils/urlUtils';
import { CUSTOM_HEADER } from 'const/index';
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
  const res = await fetch(url);
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
  TourGroupInventoryV5,
  TourGroupsV6,
  TourGroupInventoriesV6,
  TourGroupInventoriesV7,
  TourGroupSlotsV6,
  TourGroupListByCollectionV6,
  TourGroupListByCategoryV6,
  TourGroupListBySubCategoryV6,
  TourGroupReviewsV2,
  TourGroupReviewMedias,
  Collection,
  CollectionSections,
  CollectionTop,
  CollectionReviews,
  Category,
  CurrencyList,
  CalendarInventory,
  CityListV2,
  DomainConfig,
  ProductV6,
  Banners,
  CalendarInventoryForTourGroupList,
  NearbyCityList,
  Media,
  Variants,
  Airports,
  CollectionPoi,
  BulkPoiList,
  ItinerariesByTGID,
  BulkExperienceItineraries,
  CollectionTourGroups,
  GeoLocateCity,
}

const endPointsOnNewCDN = [
  HeadoutEndpoints.TourGroupsV6,
  HeadoutEndpoints.TourGroupListByCollectionV6,
  HeadoutEndpoints.CollectionSections,
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
}) => {
  let endpointSlug;

  switch (endpoint) {
    case HeadoutEndpoints.TourGroupInventoryV5:
      endpointSlug = `/api/tours/v5/tour-group/inventory/get/${id}/`;
      break;
    case HeadoutEndpoints.TourGroupsV6:
      endpointSlug = `/api/tours/v6/tour-groups/${id ? `${id}/` : ''}`;
      break;
    case HeadoutEndpoints.TourGroupInventoriesV6:
      endpointSlug = `/api/tours/v6/tour-groups/${id}/inventories/`;
      break;
    case HeadoutEndpoints.TourGroupInventoriesV7:
      endpointSlug = `/api/v7/tour-groups/${id}/inventories/`;
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
      endpointSlug = `/api/v1/collection/${id}/reviews`;
      break;
    case HeadoutEndpoints.Variants:
      endpointSlug = `/api/v7/tour-groups/variants`;
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
    case HeadoutEndpoints.CityListV2:
      endpointSlug = `/api/tours/v2/city/list`;
      break;
    case HeadoutEndpoints.GeoLocateCity:
      endpointSlug = `/api/tours/v2/geolocate/city`;
  }

  const shouldPointToNewCDN = endPointsOnNewCDN.includes(endpoint);

  let url: string;

  if (hostname) {
    url = `${hostname}${endpointSlug}`;
  } else {
    const formattedEndpointSlug = endpointSlug.replace('/tours/', '/');

    /**
     * NOTE:
     * Ensure that all API endpoints are ending with a trailing slash "/"
     * This is being done to prevent creating duplicate records on CDN.
     */
    // TODO
    url = withTrailingSlash(
      `https://${
        shouldPointToNewCDN ? 'api-mb' : 'api'
      }.headout.com${formattedEndpointSlug}`
    );
  }

  const finalParams = {
    ...(shouldPointToNewCDN && { newCDN: 'true' }),
    ...(params && params),
  };

  const finalUrl = (
    finalParams && Object.keys(finalParams).length
      ? addQueryParams(url, finalParams)
      : url
  ) as string;

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
  sortOrder?: 'DESC' | 'ASC';
  language?: string;
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
  limit = '10',
  offset = '0',
  sortOrder = 'DESC',
  language = 'EN',
}: CollectionReviewsProps) => {
  try {
    const params = {
      limit,
      offset,
      sortOrder,
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
  runRankingExperiment?: boolean;
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
  runRankingExperiment = false,
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
    ...(runRankingExperiment && {
      'src-version': 'v1',
    }),
  };
  const headers = constructHeaders({ cookies });
  const url = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupListByCollectionV6,
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

type TFetchBatchedVariants = {
  tgids: Array<number | string>;
  language?: string;
  currency?: string;
  populateTours?: boolean;
  cookies?: Record<string, any>;
};

export const fetchBatchedVariants = async ({
  tgids,
  currency,
  cookies,
  language = 'en',
  populateTours = true,
}: TFetchBatchedVariants) => {
  try {
    const params = {
      'tour-group-ids': tgids?.join(','),
      ...(language && { language }),
      ...(currency && {
        currency,
      }),
      ...(populateTours && { 'populate-tours': 'true' }),
    };
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.Variants,
      id: null,
      params,
    });
    const headers = constructHeaders({ cookies });
    const res = await fetch(url, { headers });
    return await res.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[fetchBatchedVariants]', error);
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
