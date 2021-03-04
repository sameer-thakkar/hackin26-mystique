import queryParser from 'query-string';
import { fromEntries } from 'utils/gen';

export const isAmpUrl = (query) => {
  return query.amp === '1';
};

export const getNonAmpUrl = (asPath) => {
  return asPath && asPath.replace('amp=1', '');
};

export const getStringifiedQueryFromObject = (queryJson) =>
  queryParser.stringify(queryJson);

export const removePageQuery = (query, queryParam, asPath) => {
  const newQuery = fromEntries(
    Object.entries(query).filter(([param]) => param !== queryParam)
  );
  replacePageQuery({ ...newQuery }, asPath);
};

export const replacePageQuery = (query, asPath) => {
  const locationPathName = asPath.split('?')[0];
  const queryString = getStringifiedQueryFromObject(query);
  history.replaceState(
    null,
    '',
    `${locationPathName}${queryString ? `?${queryString}` : ''}`
  );
};

export const sanitizeURL = (url) =>
  `https://${url.replace(/(http)?[s]?(:)?(\/\/)?/i, '')}`;
