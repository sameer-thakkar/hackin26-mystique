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

export const fetchTourList = ({ tgids, ...query }) =>
  fetch(
    `/api/tours/v5/tour-group/list${objectToQuery({
      'ids[]': tgids,
      ...query,
    })}`
  );

export const fetchTourGroupData = (tgid, hostName) => fetch(`${hostName}/api/tours/v5/tour-group/get/${tgid}`);

export const fetchCurrencyList = async () => {
  try {
    const res = await fetch('https://api.headout.com/api/v1/currency/list');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[fetchCurrencyList]', error);
  }
};

export const fetchCategory = async (categoryId: string) => {
  try {
    const response = await fetch(
      `https://api.headout.com/api/v1/feed/category/get/${categoryId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchCategory]', error);
  }
};

export const fetchReviewsTourGroup = (tgid, limit) => fetch(`https://api.headout.com/api/v2/review/tour-group/id/${tgid}?&limit=${limit}`);

export const fetchInventoryAPI = async (tgid: string) => {
  try {
    const response = await fetch(
      `https://api.headout.com/api/v5/tour-group/inventory/get/${tgid}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchCategory]', error);
  }
};