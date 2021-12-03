import { addQueryParams } from './urlUtils';

const objectToQuery = (query) => {
  const params = Object.entries(query);
  return params.length
    ? '?' +
        Object.entries(query)
          .filter(([, val]) => !!val)
          .map(([key, val]) => `${key}=${val}`)
          .join('&')
    : '';
};

export const swrFetcher = async (url) => {
  const res = await fetch(url);
  return res.json();
};

export enum HeadoutEndpoints {
  TourGroupsV6,
  TourGroupInventoriesV6,
  TourGroupSlotsV6,
  TourGroupListByCategoryV6,
  TourGroupListBySubCategoryV6,
  TourGroupReviewsV2,
  TourGroupCollectionV1,
  CurrencyList,
}

export const getHeadoutApiUrl = ({
  endpoint,
  hostname,
  params,
  id,
}: {
  endpoint: HeadoutEndpoints;
  hostname: string;
  params: { [key: string]: string };
  id: string | number;
}) => {
  let endpointSlug;
  switch (endpoint) {
    case HeadoutEndpoints.TourGroupCollectionV1:
      endpointSlug = `/api/tours/v1/collection/${id}/sections`;
      break;
    case HeadoutEndpoints.TourGroupsV6:
      endpointSlug = `/api/tours/v6/tour-groups/${id ? id : ''}`;
      break;
    case HeadoutEndpoints.TourGroupInventoriesV6:
      endpointSlug = `/api/tours/v6/tour-groups/${id}/inventories/`;
      break;
    case HeadoutEndpoints.TourGroupSlotsV6:
      endpointSlug = `/api/tours/v6/tour-groups/slots/get/${id}`;
      break;
    case HeadoutEndpoints.TourGroupListByCategoryV6:
      endpointSlug = `/api/tours/v6/tour-groups/list-by/category/${id}`;
      break;
    case HeadoutEndpoints.TourGroupListBySubCategoryV6:
      endpointSlug = `/api/tours/v6/tour-groups/list-by/sub-category/${id}`;
      break;
    case HeadoutEndpoints.TourGroupReviewsV2:
      endpointSlug = `/api/tours/v2/review/tour-group/id/${id}`;
      break;
    case HeadoutEndpoints.CurrencyList:
      endpointSlug = `'https://api.headout.com/api/v1/currency/list`;
      break;
  }

  const url = `${hostname}${endpointSlug}`;
  if (Object.keys(params).length) {
    const finalUrl = addQueryParams(url, params);
    return finalUrl;
  } else {
    return url;
  }
};

export const fetchTourList = ({ tgids, host = '', ...query }) => {
  return fetch(
    `${host ? host : ''}/api/tours/v6/tour-groups/${objectToQuery({
      'ids%5B%5D': tgids,
      ...query,
    })}`
  );
};

export const fetchTourGroupV6 = async ({
  tgid,
  hostname,
  language,
  currency,
}: {
  tgid: string | number;
  hostname: string;
  language?: string;
  currency?: string;
}) => {
  const params = {
    ...(language && { language }),
    ...(currency && { currency }),
  };

  const apiUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    hostname,
    params,
    id: tgid,
  });

  const res = await fetch(apiUrl);
  return await res.json();
};

export const fetchCurrencyList = async () => {
  try {
    const res = await fetch('https://api.headout.com/api/v1/currency/list');
    const data = await res.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCurrencyList]', error);
  }
};

export const fetchCategory = async (
  categoryId: string | number,
  hostname: string
) => {
  try {
    const response = await fetch(
      `${hostname}/api/tours/v1/feed/category/get/${categoryId}?limit-products=50`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCategory]', error);
  }
};

interface fetchTGIDsByCategoryV2Obj {
  categoryId: string | number;
  hostname: string;
  isSubCategory: boolean;
  city?: string;
  language?: string;
  limit?: string;
}

export const fetchTGIDsByCategoryV2 = async ({
  categoryId,
  hostname,
  isSubCategory = false,
  city = '',
  language = 'en',
  limit,
}: fetchTGIDsByCategoryV2Obj) => {
  const url = isSubCategory
    ? `${hostname}/api/tours/v6/tour-groups/list-by/sub-category/${categoryId}`
    : `${hostname}/api/tours/v6/tour-groups/list-by/category/${categoryId}`;
  const params = {
    language,
    ...(city && { city }),
    ...(limit && { limit }),
  };
  const finalUrl = addQueryParams(url, params);
  try {
    const response = await fetch(finalUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTGIDsByCategoryV2Obj]', error);
  }
};

interface fetchCollection {
  collectionId: string | number;
  hostname: string;
  language?: string;
  limit?: string;
}
export const fetchCollection = async ({
  collectionId,
  hostname,
  language = 'en',
  limit,
}: fetchCollection) => {
  const params = {
    language,
    ...(limit && { limit }),
  };
  const finalUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupCollectionV1,
    hostname,
    params,
    id: collectionId,
  });
  try {
    const response = await fetch(finalUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCollection]', error);
  }
};

export const fetchTourGroupReviews = async ({
  tgid,
  hostname,
  limit,
}: {
  tgid: string | number;
  hostname: string;
  limit?: number;
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
    const res = await fetch(url);
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
}: {
  tgid: number | string;
  hostname: string;
  minPax?: number;
  forDays?: number;
  useSeatmapPrices?: boolean;
  language?: string;
  variantId?: number;
  currency?: string | null;
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
    const url = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.TourGroupInventoriesV6,
      id: tgid,
      hostname,
      params,
    });
    const response = await fetch(url);
    const data = await response.json();
    return data;
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
}: {
  tgid: string | number;
  hostname: string;
  forDays?: number;
  currency?: string;
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
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTourGroupSlots]', error);
  }
};
