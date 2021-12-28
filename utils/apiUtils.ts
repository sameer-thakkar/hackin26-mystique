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
  TourGroupInventoryV5,
  TourGroupsV6,
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
    case HeadoutEndpoints.TourGroupInventoryV5:
      endpointSlug = `/api/tours/v5/tour-group/inventory/get/${id}/`;
      break;
    case HeadoutEndpoints.TourGroupsV6:
      endpointSlug = `/api/tours/v6/tour-groups/${id ? `${id}/` : ''}`;
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
    case HeadoutEndpoints.TourGroupCollectionV1:
      endpointSlug = `/api/tours/v1/collection/${id}/sections/`;
      break;
    case HeadoutEndpoints.CurrencyList:
      endpointSlug = `'https://api.headout.com/api/v1/currency/list/`;
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

export const fetchInventory = ({ tgid, ...query }) => {
  return fetch(
    `/api/tours/v5/tour-group/inventory/get/${tgid}/${objectToQuery(query)}`
  ).then((res) => res.json());
};

export const fetchTourList = ({ tgids, host = '', ...query }) => {
  return fetch(
    `${host ? host : ''}/api/tours/v6/tour-groups/${objectToQuery({
      'ids%5B%5D': tgids,
      ...query,
    })}`
  );
};

interface CommonApiProps {
  hostname: string;
  language?: string;
}

interface TourListProps extends CommonApiProps {
  tgids: string[] | number[];
}

export const fetchTourListV6 = async ({
  hostname,
  language,
  tgids,
}: TourListProps) => {
  try {
    const params = {
      'ids[]': tgids?.join(','),
      ...(language && { language }),
    };
    const apiUrl = getHeadoutApiUrl({
      endpoint: HeadoutEndpoints.TourGroupsV6,
      hostname,
      params,
      id: null,
    });
    const res = await fetch(apiUrl);
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
}: TourGroupProps) => {
  const params = {
    ...(language && { language }),
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
      `${hostname}/api/tours/v1/feed/category/get/${categoryId}/?limit-products=50`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCategory]', error);
  }
};

interface fetchTGIDsByCategoryV2Obj extends CommonApiProps {
  categoryId: string | number;
  isSubCategory: boolean;
  city?: string;
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
  const params = {
    language,
    ...(city && { city }),
    ...(limit && { limit }),
  };
  const url = isSubCategory
    ? getHeadoutApiUrl({
        endpoint: HeadoutEndpoints.TourGroupListBySubCategoryV6,
        hostname,
        id: categoryId,
        params,
      })
    : getHeadoutApiUrl({
        endpoint: HeadoutEndpoints.TourGroupListBySubCategoryV6,
        hostname,
        id: categoryId,
        params,
      });
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchTGIDsByCategoryV2Obj]', error);
  }
};

interface FetchCollectionProps extends CommonApiProps {
  collectionId: string | number;
  limit?: string;
}
export const fetchCollection = async ({
  collectionId,
  hostname,
  language = 'en',
  limit,
}: FetchCollectionProps) => {
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

export const fetchReviewsTourGroup = ({
  tgid,
  hostName,
  limit,
}: {
  tgid: string | number;
  hostName: string;
  limit?: string | number;
}) =>
  fetch(
    `${hostName}/api/tours/v2/review/tour-group/id/${tgid}/?limit=${limit}`
  );

export const fetchInventoryAPI = async ({
  tgid,
  hostName,
}: {
  tgid: string | number;
  hostName: string;
}) => {
  try {
    const response = await fetch(
      `${hostName}/api/tours/v5/tour-group/inventory/get/${tgid}/?use-seatmap-prices=true`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fetchCategory]', error);
  }
};
