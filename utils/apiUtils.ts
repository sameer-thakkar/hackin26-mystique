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

export const fetchInventory = ({ tgid, ...query }) =>
  fetch(
    `/api/tours/v5/tour-group/inventory/get/${tgid}${objectToQuery(query)}`
  ).then((res) => res.json());

export const fetchTourList = ({ tgids, ...query }) =>
  fetch(
    `/api/tours/v5/tour-group/list${objectToQuery({
      'ids[]': tgids,
      ...query,
    })}`
  );
