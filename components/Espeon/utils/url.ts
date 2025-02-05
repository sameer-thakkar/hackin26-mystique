export const addQueryParams = ({
  url,
  queryParams,
  replaceExistingParams = false,
}: {
  url: string;
  queryParams: URLSearchParams;
  replaceExistingParams?: boolean;
}) => {
  try {
    const urlObject = new URL(url);
    const urlSearchParams = new URLSearchParams(urlObject.search);
    queryParams.forEach((value, key) => {
      if (replaceExistingParams) urlSearchParams.set(key, value);
      else urlSearchParams.append(key, String(value));
    });
    urlObject.search = String(urlSearchParams);
    return String(urlObject);
  } catch (e) {
    return url;
  }
};
