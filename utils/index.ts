import Router from 'next/router';
import { createClient } from 'prismicio';
import type { AlternateLanguage, NumberField } from '@prismicio/types';
import dayjs from 'dayjs';
import type { IncomingHttpHeaders } from 'http';
import { ShowpageDocument } from 'types.prismic';
import { VideoMetaInfo } from 'components/common/Scripts';
import { F1TrustBoostersProp } from 'components/F1TrustBoosters/interface';
import type { CollectionDetails } from 'components/StaticBanner';
import {
  fetchCollection,
  fetchTourGroupsByCategory,
  fetchTourGroupsByCollection,
} from 'utils/apiUtils';
import {
  checkIfBroadwayMB,
  getLangObject,
  withoutTrailingSlash,
} from 'utils/helper';
import { sendLog } from 'utils/logger';
import { convertUidToUrl, getDomainFromUid } from 'utils/urlUtils';
import { BOOKING_FLOW_STAGE, BOOKING_FLOW_TYPE } from 'const/booking';
import { VARIANTS } from 'const/experiments';
import {
  BY_HO_BRAND_SCREEN_ENABLE,
  CUSTOM_TYPES,
  DEFAULT_PRISMIC_LANG,
  harryPotterExperimentUids,
  HEADOUT_NAKED_DOMAIN,
  LANGUAGE_MAP,
  LanguagesUnion,
  MB_TYPES,
  NON_SUPPORTED_LANGUAGES,
  PAGE_TYPES,
  PARTNERED_AND_SENSITIVE_COMBINATIONS,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  SHOW_DATE_SELECTION_PAGE_TGIDS,
  SUPPORTED_LANGUAGES,
  UNIT_ABBREVIATIONS,
} from 'const/index';
import { strings } from 'const/strings';
import AuthorisedBooster from 'assets/authorisedBooster';
import AuthorizedResellerBooster from 'assets/authorizedResellerBooster';
import FreeCancellationBooster from 'assets/freeCancellationBooster';
import HelpCenterBooster from 'assets/helpCenterBooster';
import SimileBooster from 'assets/simileBooster';

export const shouldDisplayCollectionRatings = ({
  averageRating,
  ratingsCount,
}: {
  averageRating: number | undefined;
  ratingsCount: number | undefined;
}): boolean => {
  if (!averageRating || !ratingsCount) return false;
  return averageRating >= 4 && ratingsCount >= 100;
};

export const getCollectionVideoMeta = (
  collectionDetails: CollectionDetails | undefined
): VideoMetaInfo | null => {
  const { displayName, heroImageUrl, videos } = collectionDetails || {};
  const { url, metadata } = videos?.[0] || {};
  const { videoDuration: duration, uploadDate } = metadata || {};

  if (!url || !duration || !uploadDate) return null;

  return {
    url,
    name: displayName!,
    thumbnailUrl: heroImageUrl!,
    duration,
    uploadDate,
  };
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
  }`.replace(/\//g, '.');

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
  redirectType?: number;
};

export const documentUidUpdateRedirectHandler = ({
  toUid,
  isDev,
  host,
  lang,
  redirectType = 301,
}: TDocumentUidUpdateRedirectHandler) => {
  const url = convertUidToUrl({
    uid: toUid,
    lang: getHeadoutLanguagecode(lang),
    isDev,
    hostname: host,
  });

  if (url) {
    const urlObject = new URL(url);
    return {
      redirectInfo: {
        url: urlObject.toString(),
        type: redirectType,
      },
    };
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
  variantId?: string | null;
  promoCode?: string | null;
  biLink?: string | null;
  isMobile?: boolean;
  currency?: string | null;
  bookSubdomain?: string | undefined;
  redirectToHeadoutBookingFlow?: boolean;
  ctaSuffix?: string;
  flowType?: string;
  showFullScreenPax?: boolean;
  showCustomCheckoutCTA?: boolean;
  isHOHORevamp?: boolean;
};

export const createBookingURL = ({
  lang,
  nakedDomain,
  tgid,
  date = null,
  variantId = null,
  tourId = null,
  promoCode = null,
  biLink = null,
  isMobile = false,
  currency = '',
  bookSubdomain = '',
  redirectToHeadoutBookingFlow = false,
  ctaSuffix = '',
  flowType = undefined,
  showFullScreenPax = false,
  showCustomCheckoutCTA,
  isHOHORevamp,
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
    case BOOKING_FLOW_TYPE.SEATMAP_IFRAME:
      bookingStageSuffix = BOOKING_FLOW_STAGE.EXTERNAL_SEATMAP;
      break;
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
    case BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER:
    case BOOKING_FLOW_TYPE.SHARED_AIRPORT_TRANSFER:
    case BOOKING_FLOW_TYPE.HOP_ON_HOP_OFF:
    case BOOKING_FLOW_TYPE.GUIDED_TOUR_PROPERTY_SELECTION:
    case BOOKING_FLOW_TYPE.PROPERTY_SELECTION:
      bookingStageSuffix = BOOKING_FLOW_STAGE.SELECT;
  }

  addTrailingSlash = bookingStageSuffix.length > 0;

  let finalHost = `${bookingFlowSubdomain}.${domain}`;

  if (
    process.env.NEXT_PUBLIC_ODE_NAMESPACE &&
    process.env.NEXT_PUBLIC_ODE_NAMESPACE.length &&
    process.env.APP_ENV !== 'production'
  ) {
    finalHost = `${process.env.NEXT_PUBLIC_ODE_NAMESPACE}.deimos.dev-headout.com`;
  }

  const urlObject = new URL(
    `https://${finalHost}${langRouteParam}/book/${tgid}/${bookingStageSuffix}${
      addTrailingSlash ? '/' : ''
    }`
  );
  //temporary setup to show date selection page for tgid 17637; will be reverted
  if (
    hasDateQueryParam &&
    !SHOW_DATE_SELECTION_PAGE_TGIDS.includes(Number(tgid))
  ) {
    urlObject.searchParams.set('date', date?.startDate);
    variantId && urlObject.searchParams.set('variantId', variantId);
    tourId && urlObject.searchParams.set('tourId', tourId);

    date?.startTime && urlObject.searchParams.set('time', date?.startTime);
  }

  if (currency) urlObject.searchParams.set('currencyCode', currency);
  if (biLink) urlObject.searchParams.set('bi', biLink);
  if (promoCode) urlObject.searchParams.set('couponCode', promoCode);
  if (showFullScreenPax)
    urlObject.searchParams.set('showFullScreenPax', 'true');

  if (showCustomCheckoutCTA !== undefined)
    urlObject.searchParams.set(
      'showCustomCheckoutCTA',
      `${showCustomCheckoutCTA}`
    );
  if (isHOHORevamp !== undefined) {
    urlObject.searchParams.set(
      'showHOHORevamp',
      isHOHORevamp ? VARIANTS.CONTROL : VARIANTS.TREATMENT
    );
  }

  if (ctaSuffix) {
    const suffixes = new URLSearchParams(ctaSuffix);
    for (const [key, value] of suffixes.entries()) {
      urlObject.searchParams.set(key, value);
    }
  }
  const brandScreenEnabled: boolean =
    isMobile &&
    BY_HO_BRAND_SCREEN_ENABLE.includes(urlObject?.hostname || urlObject?.host);
  if (brandScreenEnabled) urlObject.searchParams.set('byHO', 'true');

  urlObject.searchParams.set('cookieBanner', 'false');

  return urlObject.toString();
};

export const getNakedDomain = (host: string) => {
  const sliceCount = host.includes('mystique.dev-headout') ? 2 : 1;
  return !host?.includes('localhost')
    ? host?.split('.').slice(sliceCount).join('.')
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

export const getHeadoutLanguagelocale = (prismicLangCode: string) => {
  return (
    (LANGUAGE_MAP as Record<any, any>)[prismicLangCode]?.locale ||
    LANGUAGE_MAP.en.code
  );
};

export const getAlternateLanguages = (
  alternateLangsArray: AlternateLanguage<string, string>[],
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
  primarySubCategoryID?: NumberField;
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
  primarySubCategoryID,
}: TGeneratePromiseForCategoryTours) => {
  const allPromises = arr?.map(async (catId) => {
    let promise;
    switch (true) {
      case isCollection:
        promise = await fetchTourGroupsByCollection({
          collectionId: catId,
          hostname,
          limit: '100',
          language: getHeadoutLanguagecode(lang),
          cookies,
          ...(primarySubCategoryID && { primarySubCategoryID }),
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
          primarySubCategoryID,
        });
        break;
    }
    return promise;
  });
  return allPromises;
};

export const generateSubcatFitleredCollectionsPromises = ({
  subcategoryIds = [],
  hostname,
  lang,
  cookies,
  primaryCollection,
}: any) => {
  const allPromises = subcategoryIds?.map(async (catId: string) => {
    const promise = await fetchCollection({
      collectionId: primaryCollection,
      hostname,
      limit: '100',
      language: getHeadoutLanguagecode(lang),
      cookies,
      primarySubCategoryID: catId,
    });
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

export const getTgidsFromShow = (shows: any) => {
  return shows?.map((show: { tgid: number }) => {
    return show.tgid;
  });
};

export const getEnglishDocUid = (
  prismicAlternateLanguages: AlternateLanguage[]
) => {
  if (!prismicAlternateLanguages?.length) return null;
  const { uid } =
    prismicAlternateLanguages?.find(
      (doc) => doc.lang === DEFAULT_PRISMIC_LANG
    ) || {};
  return uid;
};

export const getAlternateLanguageDocUid = ({
  doc,
  lang,
}: {
  doc: Record<string, any>;
  lang: string;
}): string | null => {
  const { alternate_languages: alternateLanguages } = doc || {};
  if (alternateLanguages?.length) {
    const { uid } =
      alternateLanguages?.find(
        (doc: Record<string, any>) => doc.lang === lang
      ) || {};
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
  expectedDesign: string[];
}) => expectedDesign.includes(currentDesign);

export const isCollectionMB = (mbType: string | null) =>
  mbType === MB_TYPES.A1_COLLECTION ||
  mbType === MB_TYPES.B1_GLOBAL ||
  mbType === MB_TYPES.C1_COLLECTION;
export const isSubCategoryMB = (mbType: string | null) =>
  mbType === MB_TYPES.A1_SUB_CATEGORY || mbType === MB_TYPES.A2_SUB_CATEGORY;

export const isCategoryMB = (mbType: string | null) =>
  mbType === MB_TYPES.A1_CATEGORY || mbType === MB_TYPES.A2_CATEGORY;

export const isGuidedTourSubcategory = (subcategoryId?: number) => {
  return subcategoryId === 1010;
};

export const handleSettledPromiseResults = (
  results: PromiseSettledResult<any>[],
  uid?: string,
  includeRejected?: boolean
) => {
  const errors = results
    .filter((result) => result.status === 'rejected' && result?.reason)
    // @ts-ignore
    ?.map((res) => res?.reason);
  if (errors.length) {
    sendLog({
      err: errors,
      message: `[handleSettledPromiseResults] 
      uid - ${uid} - errors - ${errors}`,
    });
  }
  if (!includeRejected) {
    return (
      results
        .filter((result) => result.status === 'fulfilled' && result?.value)
        // @ts-ignore
        ?.map((res) => res?.value)
    );
  } else return results?.map((res: any) => res?.value);
};

export const isPartneredMB = (baseLangBannerAndFooterCombinations: string) => {
  return (
    baseLangBannerAndFooterCombinations ===
      PARTNERED_AND_SENSITIVE_COMBINATIONS.PARTNERED_AND_SENSITIVE ||
    baseLangBannerAndFooterCombinations ===
      PARTNERED_AND_SENSITIVE_COMBINATIONS.PARTNERED_AND_NON_SENSITIVE
  );
};

export const isA1orC1MB = (mbType: string | null) =>
  mbType === MB_TYPES.A1_COLLECTION || mbType === MB_TYPES.C1_COLLECTION;

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
          svgIcon: AuthorisedBooster(),
        },
      ]
    : [
        {
          boosterHeading: strings.HAPPY_CUSTOMER.MAIN_TEXT,
          boosterSubtext: strings.HAPPY_CUSTOMER.SUB_TEXT,
          svgIcon: SimileBooster(),
        },
        {
          boosterHeading: strings.HELP_CENTER.MAIN_TEXT,
          boosterSubtext: strings.HELP_CENTER.SUB_TEXT,
          svgIcon: HelpCenterBooster(),
        },
        {
          boosterHeading: strings.AUTHORISED_RESELLER.MAIN_TEXT,
          boosterSubtext: strings.AUTHORISED_RESELLER.SUB_TEXT,
          svgIcon: AuthorizedResellerBooster(),
        },
        {
          boosterHeading: strings.FREE_CANCELLATION,
          boosterSubtext: strings.FREE_CANCELLATION_SUBTEXT,
          svgIcon: FreeCancellationBooster(),
        },
      ];

export const displayBannerTrustBoosters = (data: Record<string, any>) =>
  data?.f1_banner_trust_booster;

export const displayProductTrustBoosters = (data: Record<string, any>) =>
  data?.f1_product_trust_booster;

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

export const getFinalisedBannerImages = (bannerImages: any) => {
  return bannerImages.map((banner: any) => {
    return {
      url: banner.image_src.url || banner.uploaded_image.url,
      alt: banner.image_alt || banner.uploaded_image.alt,
      mobileUrl:
        banner.mobile_banner_url?.url ||
        banner.mobile_banner_uploaded?.url ||
        '',
    };
  });
};

export const getTagPageMap = (uid?: string) => {
  if (checkIfBroadwayMB(uid))
    return {
      [strings.TAG_NAME.CHRISTMAS]:
        'https://www.broadway-show-tickets.com/christmas-shows-on-broadway/',
      [strings.TAG_NAME.DISNEY]:
        'https://www.broadway-show-tickets.com/disney-on-broadway/',
      [strings.TAG_NAME.TONY_WINNER]:
        'https://www.broadway-show-tickets.com/tony-award-winners/',
      [strings.TAG_NAME.ROMANCE]:
        'https://www.broadway-show-tickets.com/romantic-broadway-shows/',
      [strings.TAG_NAME.OFF_BROADWAY]:
        'https://www.broadway-show-tickets.com/off-broadway-shows-in-new-york/',
      [strings.TAG_NAME.CRITICS_CHOICE]:
        'https://www.broadway-show-tickets.com/critics-choice-shows/',
      [strings.TAG_NAME.CLASSIC]:
        'https://www.broadway-show-tickets.com/broadway-classics/',
      [strings.TAG_NAME.STARS_ON_STAGE]:
        'https://www.broadway-show-tickets.com/stars-on-stage/',
      [strings.TAG_NAME.JUKEBOX]:
        'https://www.broadway-show-tickets.com/jukebox-musicals/',
      [strings.TAG_NAME.TRUE_STORY]:
        'https://www.broadway-show-tickets.com/true-story-shows/',
      [strings.TAG_NAME.IMMERSIVE_THEATRE]:
        'https://www.broadway-show-tickets.com/immersive-theatre-shows/',
      [strings.TAG_NAME.CIRCUS]:
        'https://www.broadway-show-tickets.com/circus-shows/',
      [strings.TAG_NAME.FANTASY]:
        'https://www.broadway-show-tickets.com/fantasy-shows/',
      [strings.TAG_NAME.DRAMA]:
        'https://www.broadway-show-tickets.com/drama-shows/',
      [strings.TAG_NAME.DANCE]:
        'https://www.broadway-show-tickets.com/dance-shows/',
      [strings.TAG_NAME.THEATRICAL_CONCERT]:
        'https://www.broadway-show-tickets.com/concert-shows/',
      [strings.TAG_NAME.COMEDY]:
        'https://www.broadway-show-tickets.com/broadway-comedies/',
      [strings.TAG_NAME.NEW_ARRIVAL]:
        'https://www.broadway-show-tickets.com/new-broadway-shows/',
      [strings.TAG_NAME.KIDS]:
        'https://www.broadway-show-tickets.com/broadway-for-kids/',
      [strings.TAG_NAME.CABARET]:
        'https://www.broadway-show-tickets.com/cabaret-shows/',
      [strings.TAG_NAME.MAGIC]:
        'https://www.broadway-show-tickets.com/magic-shows/',
      [strings.TAG_NAME.MUSICALS]:
        'https://www.broadway-show-tickets.com/musical/',
      [strings.TAG_NAME.PLAYS]: 'https://www.broadway-show-tickets.com/plays/',
      [strings.TAG_NAME.OPERA]: 'https://www.broadway-show-tickets.com/operas/',
      [strings.TAG_NAME.BALLET]:
        'https://www.broadway-show-tickets.com/ballet/',
    };

  return {
    [strings.TAG_NAME.BALLET]:
      'https://www.london-theater-tickets.com/shows-in-london/ballet-shows/',
    [strings.TAG_NAME.CABARET]:
      'https://www.london-theater-tickets.com/shows-in-london/cabaret-shows/',
    [strings.TAG_NAME.CHRISTMAS]:
      'https://www.london-theater-tickets.com/christmas-shows-in-london/',
    [strings.TAG_NAME.CIRCUS]:
      'https://www.london-theater-tickets.com/shows-in-london/circus-shows/',
    [strings.TAG_NAME.CLASSIC]:
      'https://www.london-theater-tickets.com/shows-in-london/longest-running-shows/',
    [strings.TAG_NAME.COMEDY]:
      'https://www.london-theater-tickets.com/shows-in-london/comedy-shows/',
    [strings.TAG_NAME.COMING_SOON]:
      'https://www.london-theater-tickets.com/shows-in-london/upcoming-shows/',
    [strings.TAG_NAME.CRITICS_CHOICE]:
      'https://www.london-theater-tickets.com/shows-in-london/critics-choice-london-theatre-shows/',
    [strings.TAG_NAME.DANCE]:
      'https://www.london-theater-tickets.com/shows-in-london/dance-shows/',
    [strings.TAG_NAME.DISNEY]:
      'https://www.london-theater-tickets.com/shows-in-london/disney-shows/',
    [strings.TAG_NAME.DRAMA]:
      'https://www.london-theater-tickets.com/shows-in-london/drama-shows/',
    [strings.TAG_NAME.ENGLISH_NATIONAL_BALLET]:
      'https://www.london-theater-tickets.com/shows-in-london/english-national-ballet-tickets/',
    [strings.TAG_NAME.ENGLISH_NATIONAL_OPERA]:
      'https://www.london-theater-tickets.com/shows-in-london/english-national-opera-tickets/',
    [strings.TAG_NAME.FANTASY]:
      'https://www.london-theater-tickets.com/shows-in-london/fantasy-shows/',
    [strings.TAG_NAME.HALLOWEEN]:
      'https://www.london-theater-tickets.com/shows-in-london/halloween-shows/',
    [strings.TAG_NAME.IMMERSIVE_THEATRE]:
      'https://www.london-theater-tickets.com/shows-in-london/immersive-theatre/',
    [strings.TAG_NAME.JUKEBOX]:
      'https://www.london-theater-tickets.com/shows-in-london/jukebox-musicals/',
    [strings.TAG_NAME.KIDS]:
      'https://www.london-theater-tickets.com/shows-in-london/shows-for-kids/',
    [strings.TAG_NAME.MAGIC]:
      'https://www.london-theater-tickets.com/shows-in-london/magic-shows/',
    [strings.TAG_NAME.MUSICALS]:
      'https://www.london-theater-tickets.com/london-musicals/',
    [strings.TAG_NAME.NEW_ARRIVAL]:
      'https://www.london-theater-tickets.com/shows-in-london/new-west-end-shows/',
    [strings.TAG_NAME.OFF_WEST_END]:
      'https://www.london-theater-tickets.com/shows-in-london/off-west-end-shows/',
    [strings.TAG_NAME.OLIVIER_WINNER]:
      'https://www.london-theater-tickets.com/shows-in-london/olivier-award-winners/',
    [strings.TAG_NAME.OPERA]:
      'https://www.london-theater-tickets.com/shows-in-london/opera-shows/',
    [strings.TAG_NAME.PANTOMIMES]:
      'https://www.london-theater-tickets.com/pantomimes-in-london/',
    [strings.TAG_NAME.PLAYS]:
      'https://www.london-theater-tickets.com/west-end-plays-in-london/',
    [strings.TAG_NAME.ROMANCE]:
      'https://www.london-theater-tickets.com/shows-in-london/romantic-theatre-shows/',
    [strings.TAG_NAME.SHAKESPEARE]:
      'https://www.london-theater-tickets.com/shows-in-london/shakespeare-plays/',
    [strings.TAG_NAME.STARS_ON_STAGE]:
      'https://www.london-theater-tickets.com/shows-in-london/stars-on-stage/',
    [strings.TAG_NAME.THEATRICAL_CONCERT]:
      'https://www.london-theater-tickets.com/shows-in-london/concerts-tickets/',
    [strings.TAG_NAME.TRUE_STORY]:
      'https://www.london-theater-tickets.com/shows-in-london/based-on-a-true-story/',
  };
};

export const getCategorisationMetadata = async ({
  doc,
}: {
  doc: ShowpageDocument;
}) => {
  const { lang, alternate_languages } = doc || {};
  const baseLangUid = getEnglishDocUid(alternate_languages);

  try {
    const prismicClient = createClient();
    const baseLangData =
      lang !== LANGUAGE_MAP.en.locale && baseLangUid
        ? await prismicClient.getByUID('showpage', baseLangUid, {
            lang: LANGUAGE_MAP.en.locale,
          })
        : doc;

    const {
      tagged_category,
      tagged_city,
      tagged_collection,
      tagged_content_type,
      tagged_country,
      tagged_mb_type,
      tagged_page_type,
      tagged_sub_category,
    } = baseLangData?.data || {};

    return {
      tagged_category,
      tagged_city,
      tagged_country,
      tagged_collection,
      tagged_content_type,
      tagged_mb_type,
      tagged_page_type,
      tagged_sub_category,
    };
  } catch (error) {
    sendLog({
      err: error,
      message: `[getCategorisationMetadata] baseLangUid - ${baseLangUid}`,
    });
    return {
      tagged_category: null,
      tagged_city: null,
      tagged_country: null,
      tagged_collection: null,
      tagged_content_type: [],
      tagged_mb_type: null,
      tagged_page_type: null,
      tagged_sub_category: null,
    };
  }
};

export const isEmptyObject = (obj: Record<any, any>) => {
  return Object.keys(obj).length === 0;
};

export const isMBType = ({
  currentType,
  expectedType,
}: {
  currentType: string;
  expectedType: string[];
}) => expectedType.includes(currentType);

type TGetAnalyticsPageType = {
  isCityPageMB: boolean;
  isAirportTransferMB: boolean;
  isHOHO: boolean;
  isCatOrSubCatPage: boolean;
  isSubCategoryPage: boolean;
  defaultType: string;
  isSeatMapExperiment?: boolean;
  isCruises: boolean;
};

export const getAnalyticsPageType = ({
  isCityPageMB,
  isHOHO,
  isAirportTransferMB,
  isCatOrSubCatPage,
  isSubCategoryPage,
  defaultType,
  isSeatMapExperiment,
  isCruises,
}: TGetAnalyticsPageType) => {
  switch (true) {
    case isSeatMapExperiment:
      return PAGE_TYPES.VENUE_SEATS_PAGE;
    case isCityPageMB:
      return PAGE_TYPES.CITY_PAGE;
    case isHOHO:
      return PAGE_TYPES.HOHO;
    case isCruises:
      return PAGE_TYPES.CRUISES_LP;
    case isAirportTransferMB:
      return PAGE_TYPES.AIRPORT_TRANSFERS;
    case isCatOrSubCatPage && !isSubCategoryPage:
      return PAGE_TYPES.CATEGORY_PAGE;
    case isCatOrSubCatPage && isSubCategoryPage:
      return PAGE_TYPES.SUB_CATEGORY_PAGE;
    default:
      return defaultType;
  }
};

export function convertHttpHeadersToRegularHeaders(
  headers: IncomingHttpHeaders
) {
  const headerObject: { [key: string]: string } = {};

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string' || Array.isArray(value)) {
      headerObject[key] = value.toString();
    }
  }

  return new Headers(headerObject);
}

export const getPrimarySubCategoryIdData = (
  primarySubCategoryId: NumberField | undefined,
  allData: Record<string, any>
) => {
  let finalData = {};
  if (primarySubCategoryId) {
    allData.forEach((item: Record<string, any>) => {
      if (item?.subCategory?.id === primarySubCategoryId) {
        finalData = item?.subCategory;
      }
    });
  }
  return finalData;
};

export const containsPOIAndSeatmap = (array = []) => {
  return array.some((item) => /POI.*seatmap/.test(item));
};

export const checkIfHarryPotterPage = (uid: string) => {
  return harryPotterExperimentUids.includes(uid);
};
