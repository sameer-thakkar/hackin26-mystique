import Router from 'next/router';
import dayjs from 'dayjs';

import { getLangObject, withoutTrailingSlash } from '../utils/helper';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_MAP,
  FULL_LANGUAGE_MAP,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  CUSTOM_TYPES,
} from '../constants';
import { fetchCollection, fetchTGIDsByCategoryV2 } from './apiUtils';
import { convertUidToUrl, getDomainFromUid } from './urlUtils';

export const getLanguageFromPathname = ({
  pathname,
  query = {},
}: {
  pathname: string;
  query?: any;
}) => {
  const pathnameSlugs = withoutTrailingSlash(pathname)
    .split('/')
    .filter((item) => item);

  let requestedLang = pathnameSlugs[0];
  if (query?.lang) {
    requestedLang = PRISMIC_LANG_TO_ROUTE_PARAM[query?.lang];
  }

  const isLangValid = SUPPORTED_LANGUAGES.includes(requestedLang);
  if (isLangValid) {
    pathnameSlugs.shift();
  } else {
    requestedLang = 'en';
  }

  return requestedLang;
};

// Gets the UID and Language by the host and pathname
export const getPrismicProps = ({ host, pathname }) => {
  const pathnameSlugs = withoutTrailingSlash(pathname)
    .split('/')
    .filter((item) => item);

  let requestedLang = pathnameSlugs[0];

  const isLangValid = SUPPORTED_LANGUAGES.includes(requestedLang);

  if (isLangValid) {
    pathnameSlugs.shift();
  } else {
    requestedLang = 'en';
  }

  const uid = `${withoutTrailingSlash(`${host}/${pathnameSlugs.join('/')}`)}`
    .replace('stage-', '')
    .replace(/\//g, '.');

  return {
    uid,
    lang: SUPPORTED_LANGUAGES_MAP[requestedLang],
  };
};

// Used for redirecting
export const redirectTo = ({ res, url, type = 302 }) => {
  if (!type) type = 302;
  if (res) {
    res.writeHead(type, {
      Location: url,
    });
    res.end();
  } else {
    Router.push(url);
  }
};

export const documentUidUpdateRedirectHandler = ({
  toUid,
  isDev,
  host,
  lang,
  queryParamsString,
  serverResponse,
  redirectType = 301,
}: {
  toUid: string;
  isDev: boolean;
  host: string;
  lang: string;
  queryParamsString: string;
  serverResponse: any;
  redirectType?: number;
}) => {
  const url = convertUidToUrl({
    uid: toUid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    hostname: host,
  });

  const existingParams = new URLSearchParams(queryParamsString);
  const urlObject = new URL(url);
  existingParams.forEach((value, key) => {
    if (key !== 'mystique_uid' && key !== 'lang') {
      urlObject.searchParams.set(key, value);
    }
  });

  const finalUrl = urlObject.toString();
  redirectTo({
    res: serverResponse,
    url: finalUrl,
    type: redirectType,
  });
};

// Reflects promises to avoid running into the catch block
export const reflect = (promise) =>
  promise.then(
    (payload) => ({ payload, status: 'resolved' }),
    (error) => ({ error, status: 'rejected' })
  );

export const isDiscountedFuture = (tags) => tags.includes('DISCOUNTED_FUTURE');

export const isSafetyIncluded = (tags) =>
  tags.filter((x) => x.includes('SAFETY')).length > 0;

export const getDFValidityFromTags = (tags) => {
  const dateTag = tags.filter((d) => /DF-/.test(d))?.[0];
  if (dateTag) {
    return dayjs(dateTag.replace('DF-', ''), 'YYYY-MM-DD');
  }
  return null;
};

export const discountOf = ({ originalPrice: a, finalPrice: b }) =>
  a > b ? (((a - b) / a) * 100).toFixed(0) : 0;

export const createBookingURL = ({
  lang,
  nakedDomain,
  tgid,
  date = null,
  tourId = null,
  biLink,
  isMobile = false,
  currency = '',
  bookSubdomain = '',
}) => {
  const bookingFlowSubdomain =
    bookSubdomain &&
    typeof bookSubdomain === 'string' &&
    bookSubdomain !== 'undefined'
      ? bookSubdomain
      : 'book';
  const langRouteParam =
    lang && lang !== 'en' ? '/' + FULL_LANGUAGE_MAP[lang].bookingFlow : '';

  // date is passed when we directly land user on Checkout Page, skipping date selection
  let bookingStageSuffix = date ? '/checkout/' : '';
  // on Mobile, we have intermediate Pax Selection step.
  bookingStageSuffix = isMobile && date ? '/select/pax/' : '';
  const urlObject = new URL(
    `https://${bookingFlowSubdomain}.${nakedDomain}${langRouteParam}/book/${tgid}${bookingStageSuffix}`
  );
  if (date?.startDate) urlObject.searchParams.set('date', date?.startDate);
  if (date?.startDate) urlObject.searchParams.set('variantId', tourId);
  if (date?.startDate) urlObject.searchParams.set('time', date?.startTime);
  if (currency) urlObject.searchParams.set('currencyCode', currency);
  if (biLink) urlObject.searchParams.set('bi', biLink);
  return urlObject.toString();
};

export const getNakedDomain = (host) => {
  return !host.includes('localhost')
    ? host.replace('stage-', '').split('.').slice(1).join('.')
    : 'headout.com';
};

export const getSavingsPercent = (listingPriceObject) =>
  ((listingPriceObject.originalPrice - listingPriceObject.finalPrice) /
    listingPriceObject.originalPrice) *
  100;

const SPECIAL_TLDS = ['co.uk'];

const getMatchingNakedDomainPartsLength = (domain) => {
  const [tld, ..._other] =
    new RegExp('(' + SPECIAL_TLDS.join('|') + ')', 'g').exec(domain) || [];
  const tldPartsLength = tld ? tld.split('.').length : 1;
  return tldPartsLength + 1; // +1, to account for domain name.
};

export const isNakedDomain = (host) => {
  const parts = host.split('.');
  return parts.length === getMatchingNakedDomainPartsLength(host);
};

export const getHeadoutLanguagecode = (prismicLangCode) => {
  return (
    FULL_LANGUAGE_MAP[PRISMIC_LANG_TO_ROUTE_PARAM?.[prismicLangCode]]
      ?.bookingFlow || 'en'
  );
};

export const getAlternateLanguages = (
  alternateLangsArray: any[],
  isDev: boolean,
  isAmp: boolean,
  host,
  currentDocUid = ''
) => {
  if (alternateLangsArray?.length) {
    const englishDocUid =
      getEnglishDocUid(alternateLangsArray) || currentDocUid;
    const englishDomain = englishDocUid ? getDomainFromUid(englishDocUid) : '';
    return alternateLangsArray.map((doc) => {
      const { uid, lang: docLang } = doc || {};
      const domain = getDomainFromUid(uid);
      const { short: lang } = getLangObject(docLang) || {};

      return {
        url: convertUidToUrl({
          uid,
          lang,
          hostname: host,
          isDev,
          isAmp,
          ...(domain !== englishDomain && {
            removeLangPath: true,
          }),
        }),
        lang,
      };
    });
  } else {
    return [];
  }
};

export const genUniqueId = () =>
  `${Math.random().toString().slice(2)}-${Math.random().toString().slice(2)}`;

export const refsArrayToObject = (refArray) => {
  const footers = refArray
    ?.filter((ref) => ref.type === CUSTOM_TYPES.FOOTER)
    .reduce((acc, curr) => {
      if (curr?.data?.is_secondary_footer) {
        return {
          ...acc,
          secondaryFooter: curr,
        };
      } else {
        return {
          ...acc,
          commonFooter: curr,
        };
      }
    }, {});
  const { commonFooter, secondaryFooter } = footers || {};
  const [contentFramework] = refArray.filter(
    (ref) => ref.type === CUSTOM_TYPES.CONTENT_FRAMEWORK
  );
  const [globalCollection] = refArray.filter(
    (ref) => ref.type === CUSTOM_TYPES.GLOBAL_COLLECTION
  );
  const [commonHeader] = refArray.filter(
    (ref) => ref.type === CUSTOM_TYPES.HEADER
  );
  const [microsite] = refArray.filter(
    (ref) => ref.type === CUSTOM_TYPES.MICROSITE
  );

  if (commonFooter?.data) {
    commonFooter.data.powered_by_superbrand =
      commonFooter.data.powered_by_headout;
    delete commonFooter.data.powered_by_headout;
  }
  if (commonHeader?.data) {
    commonHeader.data.enable_powered_by_superbrand_logo =
      commonHeader.data.enable_powered_by_headout_logo;
    delete commonHeader.data.enable_powered_by_headout_logo;
  }
  if (microsite?.data) {
    microsite.data.enable_powered_by_superbrand_logo =
      microsite.data.enable_powered_by_headout_logo;
    delete microsite.data.enable_powered_by_headout_logo;
  }

  return {
    commonFooter,
    commonHeader,
    contentFramework,
    secondaryFooter,
    microsite,
    globalCollection,
  };
};

export const legacyBooleanCheck = (field): boolean =>
  typeof field === 'string'
    ? field?.toLowerCase() === 'yes' || field?.toLowerCase() === 'true'
    : field;

export const generatePromiseForCategoryTours = ({
  arr = [],
  hostname,
  city,
  isCollection = false,
  isCategory = false,
  isSubCategory = false,
}: {
  arr: any[];
  hostname: string;
  city: string;
  isCollection?: boolean;
  isCategory?: boolean;
  isSubCategory?: boolean;
}) => {
  const idSet = new Set(arr);
  const allIds = Array.from(idSet);

  const allPromises = allIds?.map(async (catId) => {
    let promise;
    switch (true) {
      case isCollection:
        promise = await fetchCollection({
          collectionId: catId,
          hostname,
          limit: '100',
        });
        break;
      case isCategory:
      case isSubCategory:
        promise = await fetchTGIDsByCategoryV2({
          categoryId: catId,
          isSubCategory,
          hostname,
          city,
          limit: '100',
        });
        break;
    }
    return promise;
  });
  return allPromises;
};

export const getSinglePrismicSlice = ({
  sliceName,
  slices,
}: {
  sliceName: string;
  slices: any[];
}) => {
  if (slices?.length) {
    const filteredData = slices?.filter(
      (slice) => slice.slice_type === sliceName
    );
    if (filteredData?.length) {
      return filteredData?.reduce((acc, curr) => acc + curr);
    } else {
      return {};
    }
  } else {
    return {};
  }
};

export const getEnglishDocUid = (
  prismicAlternateLanguages: { [key: string]: string }[]
) => {
  if (prismicAlternateLanguages?.length) {
    const { uid } =
      prismicAlternateLanguages?.find((doc) => doc.lang === 'en-us') || {};
    return uid;
  } else {
    return null;
  }
};
