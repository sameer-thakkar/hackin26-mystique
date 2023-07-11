import { sortDateArray } from 'utils/dateUtils';
import { currencySortFn } from 'utils/gen';
import { addQueryParams, getDomainFromUid } from 'utils/urlUtils';
import { CUSTOM_HEADER } from 'const/index';
import { simplifySlotData } from './inventoryUtils';

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

export const constructHeaders = ({ cookies = {} }) => {
  const headers = new Headers();
  if (cookies)
    headers.set(
      'cookie',
      Object.entries(cookies ?? {}).reduce(
        (acc, [key, value]) => `${acc}${key}=${value};`,
        ''
      )
    );

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
  TourGroupSlotsV6,
  TourGroupListByCollectionV6,
  TourGroupListByCategoryV6,
  TourGroupListBySubCategoryV6,
  TourGroupReviewsV2,
  Collection,
  CollectionSections,
  CollectionTop,
  Category,
  CurrencyList,
  CalendarInventory,
  DomainConfig,
  ProductV6,
  CalendarInventoryForTourGroupList,
}

export const getHeadoutApiUrl = ({
  endpoint,
  hostname,
  params,
  id,
}: {
  endpoint: HeadoutEndpoints;
  hostname?: THost;
  params?: { [_key: string]: string };
  id: string | number | null;
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
      endpointSlug = `https://api.headout.com/api/v6/tour-groups/${id}/`;
      break;
    case HeadoutEndpoints.CalendarInventoryForTourGroupList:
      endpointSlug = `/api/v7/tour-groups/calendar/`;
      break;
  }

  let url = endpointSlug;

  if (hostname) {
    url = `${hostname}${endpointSlug}`;
  } else {
    const formattedEndpointSlug = endpointSlug.replace('/tours/', '/');
    url = `https://api.headout.com${formattedEndpointSlug}`;
  }
  if (params && Object.keys(params).length) {
    const finalUrl = addQueryParams(url, params);
    return finalUrl as string;
  } else {
    return url as string;
  }
};

export const fetchTourList = ({
  tgids,
  host = '',
  ...query
}: Record<string, any>) => {
  return fetch(
    `${host ? host : ''}/api/tours/v6/tour-groups/${objectToQuery({
      'ids%5B%5D': tgids,
      ...query,
    })}`
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

  const res = await fetch(apiUrl, { headers });
  return await res.json();
};

export const fetchCurrencyList = async () => {
  try {
    const res = await fetch('https://api.headout.com/api/v1/currency/list');
    const data = await res.json();

    return data?.sort(currencySortFn);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCurrencyList]', error);
  }
};

interface fetchTourGroupsByCollectionProps extends CommonApiProps {
  collectionId: string | number;
  city?: string;
  limit?: string;
}

interface fetchTourGroupsByCategoryProps extends CommonApiProps {
  categoryId: string | number;
  isSubCategory: boolean;
  city?: string;
  limit?: string;
}

export const fetchProductData = async ({
  id,
  lang,
  hostname,
  currency,
  req,
}: any) => {
  const params = {
    language: lang,
    'use-seatmap-prices': 'false',
    'fetch-collection-svg': 'false',
    'fetch-all-listing-prices': '1',
    'include-unavailable': 'true',
    ...(currency && { currency }),
  };
  const headers = constructHeaders(
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    req ? { headers: { cookie: req.headers.cookie } } : {}
  );
  const url = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    hostname,
    id,
    params,
  });
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
  city = '',
  language = 'en',
  limit,
  fallbackToEnglish = false,
  currency,
  cookies,
}: fetchTourGroupsByCollectionProps) => {
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
  };
  const headers = constructHeaders({ cookies });
  const url = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupListByCollectionV6,
    hostname,
    id: collectionId,
    params,
  });
  try {
    const response = await fetch(url, { headers });
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTGIDsByCollectionV6]', error);
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
      'filter-category-active-product-count': filterCategoryActiveProductCount.toString(),
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
    console.error('[fetchCategory]', error);
  }
};

export const fetchTourGroupReviews = async ({
  tgid,
  hostname,
  limit,
  cookies,
}: {
  tgid: string | number;
  hostname: string;
  limit?: number;
  cookies?: { [_key: string]: any };
}) => {
  const params = {
    ...(limit && {
      limit: `${limit}`,
    }),
  };
  const url = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupReviewsV2,
    id: tgid,
    hostname,
    params,
  });
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
  currency?: string;
  fromDate?: string;
  toDate?: string;
  cookies?: { [key: string]: any };
}

export const fetchCalendarInventory = async ({
  tgid,
  currency,
  fromDate = '',
  toDate = '',
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
  const customHeaders = new Headers();
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
