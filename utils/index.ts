import Router from 'next/router';
import dayjs from 'dayjs';
import type { CollectionDetailsTypes } from 'components/StaticBanner';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_MAP,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  CUSTOM_TYPES,
  HEADOUT_NAKED_DOMAIN,
  NON_SUPPORTED_LANGUAGES,
  UNIT_ABBREVIATIONS,
  MB_TYPES,
  PARTNERED_AND_SENSITIVE_COMBINATIONS,
  SHOW_DATE_SELECTION_PAGE_TGIDS,
  LanguagesUnion,
} from 'const/index';
import { BOOKING_FLOW_STAGE, BOOKING_FLOW_TYPE } from 'const/booking';
import { getLangObject, withoutTrailingSlash } from 'utils/helper';
import { fetchCollection, fetchTourGroupsByCategory } from 'utils/apiUtils';
import { convertUidToUrl, getDomainFromUid } from 'utils/urlUtils';
import { strings } from 'const/strings';
import {
  AUTHORISED_BOOSTER,
  AUTHORIZED_RESELLER_BOOSTER,
  FREE_CANCELLATION_BOOSTER,
  HELP_CENTER_BOOSTER,
  SIMILE_BOOSTER,
} from 'assets/SvgIcons';
import { F1TrustBoostersProp } from 'components/F1TrustBoosters/interface';

export const shouldDisplayCollectionRatings = (
  collectionDetails: CollectionDetailsTypes | undefined
): boolean => {
  const { averageRating, ratingsCount } = collectionDetails ?? {};

  if (!averageRating || !ratingsCount) return false;
  return averageRating >= 4 && ratingsCount >= 100;
};

export const getLanguageFromPathname = ({
  pathname,
  query = {},
}: {
  pathname: string;
  query?: Record<string, any>;
}) => {
  const pathnameSlugs = withoutTrailingSlash(pathname)
    .split('/')
    .filter((item) => item);

  let requestedLang = pathnameSlugs[0];
  if (query?.lang) {
    requestedLang = PRISMIC_LANG_TO_ROUTE_PARAM[query?.lang];
  }

  const isLangValid = SUPPORTED_LANGUAGES.includes(
    requestedLang as LanguagesUnion
  );

  if (isLangValid) {
    pathnameSlugs.shift();
  } else {
    requestedLang = 'en';
  }

  return requestedLang;
};

// Gets the UID and Language by the host and pathname
export const getPrismicProps = ({
  host,
  pathname,
}: {
  host: string;
  pathname: string;
}) => {
  const pathnameSlugs = withoutTrailingSlash(pathname)
    .split('/')
    .filter((item) => item);

  let requestedLang = pathnameSlugs[0];

  const isLangValid = SUPPORTED_LANGUAGES.includes(
    requestedLang as LanguagesUnion
  );

  if (isLangValid) {
    pathnameSlugs.shift();
  } else {
    requestedLang = 'en';
  }

  const uid = `${
    pathname?.includes('sitemap')
      ? host
      : withoutTrailingSlash(`${host}/${pathnameSlugs.join('/')}`)
  }`
    .replace('stage-', '')
    .replace(/\//g, '.');

  return {
    uid,
    lang: LANGUAGE_MAP[requestedLang as LanguagesUnion].locale,
  };
};

// Used for redirecting
export const redirectTo = ({ res, url, type = 302 }: any) => {
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

export const renderError = ({ res, statusCode }: any) => {
  if (res) {
    res.statusCode = 404;

    return { err: { statusCode: 404 } };
  }

  return { err: { statusCode } };
};

type TDocumentUidUpdateRedirectHandler = {
  toUid: string;
  isDev: boolean;
  host: string;
  lang: string;
  queryParamsString: string;
  serverResponse: any;
  redirectType?: number;
};

export const documentUidUpdateRedirectHandler = ({
  toUid,
  isDev,
  host,
  lang,
  queryParamsString,
  serverResponse,
  redirectType = 301,
}: TDocumentUidUpdateRedirectHandler) => {
  const url = convertUidToUrl({
    uid: toUid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    hostname: host,
  });

  const existingParams = new URLSearchParams(queryParamsString);

  if (url) {
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
  }
};

// Reflects promises to avoid running into the catch block
export const reflect = (promise: any) =>
  promise.then(
    (payload: any) => ({
      payload,
      status: 'resolved',
    }),
    (error: any) => ({
      error,
      status: 'rejected',
    })
  );

export const isSafetyIncluded = (tags: any[]) =>
  tags.filter((x) => x.includes('SAFETY')).length > 0;

export const getDFValidityFromTags = (tags: any[]) => {
  const dateTag = tags.filter((d: any) => /DF-/.test(d))?.[0];
  if (dateTag) {
    return dayjs(dateTag.replace('DF-', ''), 'YYYY-MM-DD');
  }
  return null;
};

export const discountOf = ({
  originalPrice: a,
  finalPrice: b,
}: {
  originalPrice: number;
  finalPrice: number;
}) => (a > b ? (((a - b) / a) * 100).toFixed(0) : 0);

type TCreateBookingUrl = {
  lang: string;
  nakedDomain: string | null;
  tgid: string | number;
  date?: Record<string, any> | null;
  tourId?: string | null;
  promoCode?: string | null;
  biLink?: string | null;
  isMobile?: boolean;
  currency?: string | null;
  bookSubdomain?: string | undefined;
  redirectToHeadoutBookingFlow?: boolean;
  ctaSuffix?: string;
  flowType?: string;
};

export const createBookingURL = ({
  lang,
  nakedDomain,
  tgid,
  date = null,
  tourId = null,
  promoCode = null,
  biLink = null,
  isMobile = false,
  currency = '',
  bookSubdomain = '',
  redirectToHeadoutBookingFlow = false,
  ctaSuffix = '',
  flowType = undefined,
}: TCreateBookingUrl) => {
  const bookingFlowSubdomain =
    bookSubdomain &&
    typeof bookSubdomain === 'string' &&
    bookSubdomain !== 'undefined'
      ? bookSubdomain
      : 'book';
  const hasDateQueryParam = typeof date?.startDate !== 'undefined';
  const langRouteParam =
    lang && lang !== LANGUAGE_MAP.en.code
      ? '/' + LANGUAGE_MAP[lang as LanguagesUnion].code
      : '';

  const domain = redirectToHeadoutBookingFlow
    ? HEADOUT_NAKED_DOMAIN
    : nakedDomain;

  let bookingStageSuffix: string,
    addTrailingSlash = false;

  // on Mobile, we have intermediate Pax Selection step.
  bookingStageSuffix = isMobile && date ? 'select/pax' : '';

  switch (flowType) {
    case BOOKING_FLOW_TYPE.SEATMAP:
      bookingStageSuffix = hasDateQueryParam
        ? BOOKING_FLOW_STAGE.SEATMAP_VARIANT
        : BOOKING_FLOW_STAGE.SEATMAP_SELECT;
      break;
    case BOOKING_FLOW_TYPE.SVG:
      bookingStageSuffix = hasDateQueryParam
        ? BOOKING_FLOW_STAGE.SVG_VARIANT
        : BOOKING_FLOW_STAGE.SVG_SELECT;
      break;
    case BOOKING_FLOW_TYPE.RESERVATION:
    case BOOKING_FLOW_TYPE.COMBO:
    case BOOKING_FLOW_TYPE.NORMAL:
      bookingStageSuffix = BOOKING_FLOW_STAGE.SELECT;
  }

  addTrailingSlash = bookingStageSuffix.length > 0;

  const urlObject = new URL(
    `https://${bookingFlowSubdomain}.${domain}${langRouteParam}/book/${tgid}/${bookingStageSuffix}${
      addTrailingSlash ? '/' : ''
    }`
  );

  //temporary setup to show date selection page for tgid 17637; will be reverted
  if (
    hasDateQueryParam &&
    !SHOW_DATE_SELECTION_PAGE_TGIDS.includes(Number(tgid))
  ) {
    urlObject.searchParams.set('date', date?.startDate);
    tourId && urlObject.searchParams.set('variantId', tourId);

    date?.startTime && urlObject.searchParams.set('time', date?.startTime);
  }

  if (currency) urlObject.searchParams.set('currencyCode', currency);
  if (biLink) urlObject.searchParams.set('bi', biLink);
  if (promoCode) urlObject.searchParams.set('couponCode', promoCode);
  if (ctaSuffix) {
    const suffixes = new URLSearchParams(ctaSuffix);
    for (const [key, value] of suffixes.entries()) {
      urlObject.searchParams.set(key, value);
    }
  }
  return urlObject.toString();
};

export const getNakedDomain = (host: string) => {
  return !host?.includes('localhost')
    ? host?.replace('stage-', '').split('.').slice(1).join('.')
    : HEADOUT_NAKED_DOMAIN;
};

export const getSavingsPercent = (listingPriceObject: Record<string, any>) =>
  ((listingPriceObject.originalPrice - listingPriceObject.finalPrice) /
    listingPriceObject.originalPrice) *
  100;

const SPECIAL_TLDS = ['co.uk'];

const getMatchingNakedDomainPartsLength = (domain: string) => {
  const [tld, ..._other] =
    new RegExp('(' + SPECIAL_TLDS.join('|') + ')', 'g').exec(domain) || [];
  const tldPartsLength = tld ? tld.split('.').length : 1;
  return tldPartsLength + 1; // +1, to account for domain name.
};

export const isNakedDomain = (host: string) => {
  const parts = host.split('.');
  return parts.length === getMatchingNakedDomainPartsLength(host);
};

export const getHeadoutLanguagecode = (prismicLangCode: string) => {
  return (
    LANGUAGE_MAP[
      PRISMIC_LANG_TO_ROUTE_PARAM?.[prismicLangCode] as LanguagesUnion
    ]?.code || 'en'
  );
};

export const getAlternateLanguages = (
  alternateLangsArray: Record<string, any>[],
  isDev: boolean,
  host: string,
  currentDocUid = ''
) => {
  if (alternateLangsArray?.length) {
    const englishDocUid =
      getEnglishDocUid(alternateLangsArray) || currentDocUid;
    const englishDomain = englishDocUid ? getDomainFromUid(englishDocUid) : '';
    // Don't show chinese docs in header or in hreflang as we have stopped supporting chinese language
    const filteredLanguagesArray = alternateLangsArray?.filter(
      (langObj) => !NON_SUPPORTED_LANGUAGES.includes(langObj?.lang)
    );
    return filteredLanguagesArray.map((doc) => {
      const { uid, lang: docLang } = doc || {};
      const domain = getDomainFromUid(uid);
      const { code: lang } = getLangObject(docLang) || {};

      return {
        url: convertUidToUrl({
          uid,
          lang,
          hostname: host,
          isDev,
          ...(domain !== englishDomain && {
            removeLangPath: true,
          }),
        }),
        lang,
        code: lang,
      };
    });
  } else {
    return [];
  }
};

export const genUniqueId = () =>
  `${Math.random().toString().slice(2)}-${Math.random().toString().slice(2)}`;

export const refsArrayToObject = (refArray: Record<string, any>[]) => {
  const footers = refArray
    ?.filter((ref: any) => ref.type === CUSTOM_TYPES.FOOTER)
    .reduce((acc: any, curr: any) => {
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
    (ref: any) => ref.type === CUSTOM_TYPES.CONTENT_FRAMEWORK
  );
  const [globalCollection] = refArray.filter(
    (ref: any) => ref.type === CUSTOM_TYPES.GLOBAL_COLLECTION
  );
  const [commonHeader] = refArray.filter(
    (ref: any) => ref.type === CUSTOM_TYPES.HEADER
  );
  const [microsite] = refArray.filter(
    (ref: any) => ref.type === CUSTOM_TYPES.MICROSITE
  );

  return {
    commonFooter,
    commonHeader,
    contentFramework,
    secondaryFooter,
    microsite,
    globalCollection,
  };
};

export const legacyBooleanCheck = (field: string | undefined | boolean) => {
  if (typeof field === 'undefined') return false;
  return typeof field === 'string'
    ? field?.toLowerCase() === 'yes' || field?.toLowerCase() === 'true'
    : field;
};

type TGeneratePromiseForCategoryTours = {
  arr: any[];
  hostname: string;
  city: string;
  isCollection?: boolean;
  isCategory?: boolean;
  isSubCategory?: boolean;
  lang: string;
  cookies?: Record<string, string>;
};

export const generatePromiseForCategoryTours = ({
  arr = [],
  hostname,
  city,
  isCollection = false,
  isCategory = false,
  isSubCategory = false,
  lang,
  cookies,
}: TGeneratePromiseForCategoryTours) => {
  const allPromises = arr?.map(async (catId) => {
    let promise;
    switch (true) {
      case isCollection:
        promise = await fetchCollection({
          collectionId: catId,
          hostname,
          limit: '100',
          language: getHeadoutLanguagecode(lang),
          cookies,
        });
        break;
      case isCategory:
      case isSubCategory:
        promise = await fetchTourGroupsByCategory({
          categoryId: catId,
          isSubCategory,
          hostname,
          city,
          limit: '100',
          language: getHeadoutLanguagecode(lang),
          cookies,
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
  prismicAlternateLanguages: Record<string, any>[]
) => {
  if (prismicAlternateLanguages?.length) {
    const { uid } =
      prismicAlternateLanguages?.find((doc) => doc.lang === 'en-us') || {};
    return uid;
  } else {
    return null;
  }
};

export const getCollectionSection = (
  collectionData: Record<string, any>,
  sectionType: 'PINNED_CARDS' | 'GENERIC' | 'HEADOUT_PICKS'
) => {
  const section = collectionData?.sections?.find(
    (section: any) => section.type === sectionType
  );
  return section?.tourGroups?.items;
};

export const truncateNumber = (num = 0, truncateAfter = 3) => {
  if (num < 10 ** (truncateAfter - 1)) return num.toString();
  let truncatedNumber = num;
  for (let i = UNIT_ABBREVIATIONS.length - 1; i >= 0; i--) {
    const truncationSize = 10 ** ((i + 1) * 3);
    if (num >= truncationSize) {
      truncatedNumber = (Number(
        toFixedWithPrecision(num / truncationSize, 1)
      ).toLocaleString() + UNIT_ABBREVIATIONS[i]) as any;
      break;
    }
  }
  return truncatedNumber.toString();
};

const toFixedWithPrecision = (num: number, precision: number) => {
  const precisionExp = 10 ** precision;
  return Math.trunc(Math.round(num * precisionExp)) / precisionExp;
};

export const checkIfMicrosite = ({ type }: Record<string, any>) =>
  type === CUSTOM_TYPES.MICROSITE;

export const isMBDesign = ({
  currentDesign,
  expectedDesign,
}: {
  currentDesign: string;
  expectedDesign: string;
}) => currentDesign === expectedDesign;

export const isCollectionMB = (mbType: string) =>
  mbType === MB_TYPES.A1_COLLECTION ||
  mbType === MB_TYPES.B1_GLOBAL ||
  mbType === MB_TYPES.C1_COLLECTION;

export const isPartneredMB = (baseLangBannerAndFooterCombinations: string) => {
  return (
    baseLangBannerAndFooterCombinations ===
      PARTNERED_AND_SENSITIVE_COMBINATIONS.PARTNERED_AND_SENSITIVE ||
    baseLangBannerAndFooterCombinations ===
      PARTNERED_AND_SENSITIVE_COMBINATIONS.PARTNERED_AND_NON_SENSITIVE
  );
};

export const getBannerAndFooterSubtext = (
  baseLangIsPoiMb: boolean | null,
  baseLangBannerAndFooterCombinations: string
) => {
  if (baseLangIsPoiMb) {
    switch (baseLangBannerAndFooterCombinations) {
      case PARTNERED_AND_SENSITIVE_COMBINATIONS.PARTNERED_AND_SENSITIVE:
        return strings.BANNER_FOOTER_SUBTEXT.PARTNERED_SENSITIVE;

      case PARTNERED_AND_SENSITIVE_COMBINATIONS.PARTNERED_AND_NON_SENSITIVE:
        return strings.BANNER_FOOTER_SUBTEXT.PARTNERED_NON_SENSITIVE;

      case PARTNERED_AND_SENSITIVE_COMBINATIONS.NON_PARTNERED_AND_SENSITIVE:
        return strings.BANNER_FOOTER_SUBTEXT.NON_PARTNERED_SENSITIVE;

      case PARTNERED_AND_SENSITIVE_COMBINATIONS.NON_PARTNERED_AND_NON_SENSITIVE:
        return strings.BANNER_FOOTER_SUBTEXT.NON_PARTNERED_NON_SENSITIVE;
    }
  } else if (baseLangIsPoiMb === null) {
    return strings.BANNER_FOOTER_SUBTEXT.PARTNERED_SENSITIVE;
  } else {
    return '';
  }
};

export const getF1MBTrustBoosters = (
  isBannerTrustBooster: boolean
): F1TrustBoostersProp[] =>
  isBannerTrustBooster
    ? [
        {
          boosterHeading: strings.AUTHORISED_AND_TRUSTED_PARTNER,
          boosterSubtext: '',
          svgIcon: AUTHORISED_BOOSTER(),
        },
      ]
    : [
        {
          boosterHeading: strings.HAPPY_CUSTOMER.MAIN_TEXT,
          boosterSubtext: strings.HAPPY_CUSTOMER.SUB_TEXT,
          svgIcon: SIMILE_BOOSTER(),
        },
        {
          boosterHeading: strings.HELP_CENTER.MAIN_TEXT,
          boosterSubtext: strings.HELP_CENTER.SUB_TEXT,
          svgIcon: HELP_CENTER_BOOSTER(),
        },
        {
          boosterHeading: strings.AUTHORISED_RESELLER.MAIN_TEXT,
          boosterSubtext: strings.AUTHORISED_RESELLER.SUB_TEXT,
          svgIcon: AUTHORIZED_RESELLER_BOOSTER(),
        },
        {
          boosterHeading: strings.FREE_CANCELLATION,
          boosterSubtext: strings.FREE_CANCELLATION_SUBTEXT,
          svgIcon: FREE_CANCELLATION_BOOSTER(),
        },
      ];

export const displayBannerTrustBoosters = (data: Record<string, any>) =>
  data?.data?.f1_banner_trust_booster;

export const displayProductTrustBoosters = (data: Record<string, any>) =>
  data?.data?.f1_product_trust_booster;

export const deepDeleteKeys = ({
  obj,
  keys,
}: {
  obj: Record<string, any>;
  keys: string[];
}): Record<string, any> => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => deepDeleteKeys({ obj: item, keys }));
  }

  return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
    if (!keys.includes(key)) {
      const value = obj[key];
      if (value && typeof value === 'object') {
        acc[key] = deepDeleteKeys({ obj: value, keys });
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, {});
};
