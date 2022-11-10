import {
  ENTERTAINMENT_MB_BREADCRUMBS,
  PRISMIC_LANG_TO_ROUTE_PARAM,
} from 'const/index';
import { LANGUAGE_MAP } from 'const/index';
import queryParser from 'query-string';
import { getPrismicProps } from 'utils';
import { fromEntries } from 'utils/gen';

import { getLangObject } from './helper';

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
  const queryString =
    typeof query === 'string' ? query : getStringifiedQueryFromObject(query);
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
      lang = LANGUAGE_MAP[PRISMIC_LANG_TO_ROUTE_PARAM[queryParamLang]].locale;
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

export const getDomainFromUid = (uid) => {
  const modUid = `${uid}.`; // add trailing . to identify end of UID
  const regex = /[\w\d-]+\.[\w\d-]+\.(([\w]{1,}\.[\w]{1,3}\.)|([\w]{2,}\.))/;
  const domain = modUid.match(regex)?.[0]?.slice(0, -1);
  return domain;
};

export const convertUidToUrl = ({
  uid,
  lang = 'en',
  isDev,
  hostname = '',
  removeLangPath = false,
}: {
  uid: string;
  hostname?: string;
  lang?: string;
  isDev?: boolean;
  removeLangPath?: boolean;
}) => {
  const getUrl = (uid: string, lang, isStage: boolean) => {
    let url;
    const modUid = `${uid}.`; // add trailing . to identify end of UID
    const domain = getDomainFromUid(uid);
    const pathName = modUid.split(domain)?.filter((string) => string.length);
    if (domain?.length) {
      url = `https://${isStage ? 'stage-' : ''}${domain}${
        lang !== 'en' && !removeLangPath ? `/${lang}` : ''
      }`;
      if (pathName.length) {
        pathName.forEach((name) => {
          url += name.replace(/\./g, '/');
        });
      }
    }
    return url;
  };
  const devUrl = `http://${hostname}/?mystique_uid=${uid}&lang=${
    getLangObject(lang)?.locale
  }`;
  const isStage = hostname?.includes('stage-');
  if (isStage) {
    if (isDev) {
      return devUrl;
    } else {
      const url = getUrl(uid, lang, true);
      return url;
    }
  }
  if (isDev) {
    return devUrl;
  }

  if (uid) {
    let url = getUrl(uid, lang, false);
    return url;
  } else {
    return null;
  }
};

export const addQueryParams = (
  url: string,
  params: { [key: string]: string }
) => {
  if (url) {
    let theURL = new URL(url);
    if (Object.keys(params).length > 0) {
      for (const property in params) {
        const key = property;
        const value = params[property];
        theURL.searchParams.set(key, value);
      }
    }
    return theURL.toString();
  }
};

export const getShowpageBreadcrumbUid = (
  primarySubCategoryName: string,
  isLTT: boolean
) => {
  const breadcrumbsMap =
    ENTERTAINMENT_MB_BREADCRUMBS?.[isLTT ? 'LTT' : 'BROADWAY'];
  switch (primarySubCategoryName) {
    case 'Musicals':
      return breadcrumbsMap?.MUSICALS;
    case 'Plays':
      return breadcrumbsMap?.PLAYS;
    case 'Opera':
      return breadcrumbsMap?.OPERA;
    default:
      return breadcrumbsMap?.ROOT_DOMAIN;
  }
};
