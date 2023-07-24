import queryParser from 'query-string';
import { getPrismicProps } from 'utils';
import { fromEntries } from 'utils/gen';
import { checkIfLTTMB, getLangObject } from 'utils/helper';
import {
  ENTERTAINMENT_MB_BREADCRUMBS,
  LANGUAGE_MAP,
  LanguagesUnion,
  PRISMIC_LANG_TO_ROUTE_PARAM,
} from 'const/index';

export const getStringifiedQueryFromObject = (queryJson: Record<string, any>) =>
  queryParser.stringify(queryJson);

export const getQueryObject = (location: any): Record<string, any> =>
  queryParser.parse(location.search);

export const removePageQuery = (
  query: Record<string, any>,
  queryParam: string,
  asPath: string
) => {
  const newQuery = fromEntries(
    Object.entries(query).filter(([param]) => param !== queryParam)
  );
  replacePageQuery({ ...newQuery }, asPath);
};

export const replacePageQuery = (
  query: Record<string, any>,
  asPath: string
) => {
  const locationPathName = asPath.split('?')[0];
  const queryString =
    typeof query === 'string' ? query : getStringifiedQueryFromObject(query);
  history.replaceState(
    null,
    '',
    `${locationPathName}${queryString ? `?${queryString}` : ''}`
  );
};

export const sanitizeURL = (url: string) =>
  `https://${url.replace(/(http)?[s]?(:)?(\/\/)?/i, '')}`;

export const getLangUID = (req: any, query: Record<string, any>) => {
  let uid, lang;
  if (!req && typeof window === 'undefined') return {}; // next static optimsation flow.
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
        LANGUAGE_MAP[
          (PRISMIC_LANG_TO_ROUTE_PARAM[queryParamLang] as LanguagesUnion) ||
            queryParamLang
        ]?.locale;
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

export function getValidUrl(url: string) {
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

export const getValidUrlParams = (query: Record<string, any>) =>
  Object.entries(query)
    .filter(([key]) => key !== 'slug')
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
    .trim();

export const getDomainFromUid = (uid: string) => {
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
  const getUrl = (uid: string, lang: string, isStage: boolean) => {
    let url: string = '';
    const modUid = `${uid}.`; // add trailing . to identify end of UID
    const domain = getDomainFromUid(uid);
    if (domain) {
      const pathName = modUid.split(domain)?.filter((string) => string.length);
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
    return '';
  }
};

export const addQueryParams = (url: string, params: Record<string, string>) => {
  if (url) {
    let theURL;
    try {
      theURL = new URL(url);
    } catch (e) {
      //
    }
    if (Object.keys(params).length > 0) {
      for (const property in params) {
        const key = property;
        const value = params[property];
        theURL?.searchParams.set(key, value);
      }
    }
    return theURL?.toString();
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

export const getLogoRedirectionUrl = ({
  uid,
  lang = 'en',
  isDev,
  host = '',
}: {
  uid: string;
  lang?: string;
  isDev?: boolean;
  host?: string;
}) => {
  const domainArray = getDomainFromUid(uid)?.split('.');
  if (domainArray) domainArray[0] = 'www';
  const parentDomain = domainArray?.join('.');

  const isStage = host?.includes('stage-');
  //Note: Temporary logo link override for this particular MB, till we solve for Themeparks MBs
  const isMoviePark = uid === 'moviepark.themeparkstickets.com';
  const redirectTo = isMoviePark ? uid : parentDomain;

  switch (true) {
    case isDev:
      return `http://${host}/?mystique_uid=${redirectTo}&lang=${
        getLangObject(lang)?.locale
      }`;
    case isStage:
      return `http://stage-microbrands.headout.com/?mystique_uid=${redirectTo}&lang=${
        getLangObject(lang)?.locale
      }`;
    case !!uid:
      return `https://${redirectTo}${lang !== 'en' ? `/${lang}` : ''}/`;
    default:
      return null;
  }
};

export const addToSearchParams = (
  searchParam: string,
  params: Record<string, string | string[]> = {}
) => {
  const searchParams = new URLSearchParams(searchParam);
  Object.entries(params ?? {}).forEach(([key, val]) => {
    searchParams.set(key, String(val));
  });
  const searchParamsString = searchParams.toString();

  return `${searchParamsString ? '?' + searchParamsString : ''}`;
};

export const addUrlParams = ({
  urlParams,
  historyState,
  replace = false,
}: {
  urlParams: Record<string, string | string[]>;
  historyState: any;
  replace: boolean;
}) => {
  const asPath =
    '/' +
    addToSearchParams('', {
      ...urlParams,
    });
  if (replace) window.history.replaceState(historyState, '', asPath);
  else window.history.pushState(historyState, '', asPath);
  return asPath;
};

export const getFormattedUrlSlug = (urlSlugs: IUrlSlugs, lang = 'en') => {
  // replacing '#' with '/' in all urlSlugs to decode the encoding done
  // to prevent crawlers from crawling the url
  const decodedUrlSlugs = Object.entries(urlSlugs).reduce(
    (acc: IUrlSlugs, [lang, urlSlug]) => {
      if (typeof urlSlug !== 'string') acc[lang] = '';
      else acc[lang] = urlSlug.replaceAll('#', '/');
      return acc;
    },
    {}
  );
  const formattedLang = lang.toUpperCase().replace(/-/g, '_');

  return typeof decodedUrlSlugs?.[formattedLang] !== 'undefined' &&
    lang !== 'en'
    ? `/${lang}/${decodedUrlSlugs?.[formattedLang]
        ?.split('/')
        .slice(3)
        .join('/')}`
    : `/${decodedUrlSlugs?.EN?.split('/').slice(2).join('/')}`;
};

export const getTagPageLink = ({
  url,
  lang = LANGUAGE_MAP.en.code,
  uid,
  isProd,
}: {
  url: string | null | undefined;
  lang: string;
  uid: string;
  isProd: boolean;
}) =>
  checkIfLTTMB(uid)
    ? addLanguageParamToUrl({
        url,
        lang: lang?.toLowerCase(),
        isProd,
      })
    : null;

export const addLanguageParamToUrl = ({
  url,
  lang = LANGUAGE_MAP.en.code,
  isProd,
}: {
  url: string | null | undefined;
  lang: string;
  isProd: boolean;
}) => {
  if (!url) return null;

  if (lang !== LANGUAGE_MAP.en.code) {
    if (url.startsWith('/')) {
      return `/${lang}${url}`;
    } else {
      const splitUrl = url.split('/');
      const spliceStartIndex = url.startsWith('http') ? 3 : 1;
      if (isProd) splitUrl.splice(spliceStartIndex, 0, lang);
      return isProd
        ? splitUrl.join('/')
        : splitUrl.filter((item) => item !== lang).join('/');
    }
  }

  return url;
};

export const getEncodedUrlSlugs = (urlSlugs: IUrlSlugs) =>
  // replacing '/' with '#' in all urlSlugs to prevent crawlers from crawling the url
  Object.entries(urlSlugs).reduce((acc: IUrlSlugs, [lang, urlSlug]) => {
    if (typeof urlSlug !== 'string') acc[lang] = '';
    else acc[lang] = urlSlug?.replaceAll('/', '#');
    return acc;
  }, {});

export const getLttVerticalPosterLink = (tgid?: number) => {
  if (!tgid) return;
  return `https://tourlandish.s3.amazonaws.com/assets/images/ltt/vertical-product-cards/${tgid}.png`;
};
