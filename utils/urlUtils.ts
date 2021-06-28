import { PRISMIC_LANG_TO_ROUTE_PARAM } from 'const/index';
import { FULL_LANGUAGE_MAP } from 'const/index';
import queryParser from 'query-string';
import { getPrismicProps } from 'utils';
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

export const getLangUID = (req, query) => {
  let uid, lang;
  const { host } = req?.headers || window?.location;
  const pathname =
    req?.url?.split('?')?.[0]?.split('#')?.[0] || window.location.pathname;
  const isDev = req
    ? !!query.mystique_uid
    : window.location.search.includes('mystique_uid');
  if (req) {
    // Server side rendering
    if (isDev) {
      const { mystique_uid: queryParamUID, lang: queryParamLang } = query;
      uid = queryParamUID;
      lang =
        FULL_LANGUAGE_MAP[PRISMIC_LANG_TO_ROUTE_PARAM[queryParamLang]]
          .paramLang;
    } else {
      const { uid: reqUID, lang: reqLang } = getPrismicProps({
        host,
        pathname,
      });
      uid = reqUID;
      lang = reqLang;
    }
  } else {
    // Client side rendering
    if (isDev) {
      const urlParams = new URLSearchParams(window.location.search);
      uid = urlParams.get('mystique_uid');
      lang = urlParams.get('lang');
    } else {
      const { uid: reqUID, lang: reqLang } = getPrismicProps({
        host,
        pathname,
      });
      uid = reqUID;
      lang = reqLang;
    }
  }
  return { uid, lang };
};

export function getValidUrl(url) {
  if (url) {
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    if (url.startsWith('www')) {
      return `https://${url}`;
    }
  }
  return url;
}

export const getValidUrlParams = (query) =>
  Object.entries(query)
    .filter(([key]) => key !== 'slug')
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
    .trim();

export const convertUidToUrl = (uid) => {
  if (uid) {
    let url;
    const regex = /[a-zA-z0-9-]+\.[a-zA-z0-9-]+((\.[a-z]{1,3}\.[a-z]{1,3})|(\.[a-z]{2,3}))/g;
    const domain = uid.match(regex);
    const pathName = uid.split(domain)?.filter((string) => string.length);
    if (domain?.length) {
      url = `https://${domain[0]}`;
      if (pathName.length) {
        pathName.forEach((name) => {
          url += name.replace('.', '/');
        });
      }
    }
    return url;
  } else {
    return null;
  }
};
