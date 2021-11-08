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

export const fetchInventory = ({ tgid, ...query }) => {
  return fetch(
    `/api/tours/v5/tour-group/inventory/get/${tgid}${objectToQuery(query)}`
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

export const fetchTourGroupV6 = async ({
  tgid,
  hostname,
  language,
}: {
  tgid: string | number;
  hostname: string;
  language?: string;
}) => {
  const params = {
    ...(language && { language }),
  };
  const url = addQueryParams(
    `${hostname}/api/tours/v6/tour-groups/${tgid}`,
    params
  );
  const res = await fetch(url);
  return await res.json();
};
export const fetchCurrencyList = async () => {
  try {
    const res = await fetch('https://api.headout.com/api/v1/currency/list');
    const data = await res.json();
    return data;
  } catch (error) {
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
  const url = `${hostname}/api/tours/v1/collection/${collectionId}/sections`;
  const finalUrl = addQueryParams(url, params);
  try {
    const response = await fetch(finalUrl);
    const data = await response.json();
    return data;
  } catch (error) {
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
  fetch(`${hostName}/api/tours/v2/review/tour-group/id/${tgid}?limit=${limit}`);

export const fetchInventoryAPI = async ({
  tgid,
  hostName,
}: {
  tgid: string | number;
  hostName: string;
}) => {
  try {
    const response = await fetch(
      `${hostName}/api/tours/v5/tour-group/inventory/get/${tgid}?use-seatmap-prices=true`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchCategory]', error);
  }
};
