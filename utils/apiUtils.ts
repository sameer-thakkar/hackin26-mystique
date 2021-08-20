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
      'ids[]': tgids,
      ...query,
    })}`
  );
};

export const fetchTourGroup = (tgid, hostName) =>
  fetch(`${hostName}/api/tours/v6/tour-groups/${tgid}`);

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
  lang?: string;
}

export const fetchTGIDsByCategoryV2 = async ({
  categoryId,
  hostname,
  isSubCategory = false,
  city = '',
  lang = 'EN',
}: fetchTGIDsByCategoryV2Obj) => {
  const url = isSubCategory
    ? `${hostname}/api/tours/v6/tour-groups/list-by/sub-category/${categoryId}`
    : `${hostname}/api/tours/v6/tour-groups/list-by/category/${categoryId}`;

  try {
    const response = await fetch(
      `${url}?language=${lang}&limit=100${city ? `&city=${city}` : ''}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchTGIDsByCategoryV2Obj]', error);
  }
};

interface fetchCollection {
  collectionId: string | number;
  hostname: string;
  lang?: string;
}
export const fetchCollection = async ({
  collectionId,
  hostname,
  lang = 'EN',
}: fetchCollection) => {
  const url = `${hostname}/api/tours/v1/collection/${collectionId}/sections?limit=100&language=${lang}`;

  try {
    const response = await fetch(url);
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
      `${hostName}/api/v5/tour-group/inventory/get/${tgid}?use-seatmap-prices=true`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchCategory]', error);
  }
};
