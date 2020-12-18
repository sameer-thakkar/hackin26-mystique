import Router from 'next/router';
import { withoutTrailingSlash } from '../utils/helper';
import dayjs from 'dayjs';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_MAP,
  FULL_LANGUAGE_MAP,
  PRISMIC_LANG_TO_ROUTE_PARAM,
  CUSTOM_TYPES,
} from '../constants';

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
  df = false,
  date = null,
  tourId = null,
  biLink,
  isMobile = false,
}) => {
  const langRouteParam =
    lang && lang !== 'en' ? '/' + FULL_LANGUAGE_MAP[lang].bookingFlow : '';

  // date is passed when we directly land user on Checkout Page, skipping date selection
  let bookingStageSuffix = date ? '/checkout/' : '';
  // on Mobile, we have intermediate Pax Selection step.
  bookingStageSuffix = isMobile && date ? '/select/pax/' : '';
  const urlObject = new URL(
    `https://book.${nakedDomain}${langRouteParam}/book/${tgid}${bookingStageSuffix}`
  );
  if (df) urlObject.searchParams.set('isDiscountedFutures', 'true');
  if (date?.startDate) urlObject.searchParams.set('date', date?.startDate);
  if (date?.startDate) urlObject.searchParams.set('variantId', tourId);
  if (date?.startDate) urlObject.searchParams.set('time', date?.startTime);
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

export const genUniqueId = () =>
  `${Math.random().toString().slice(2)}-${Math.random().toString().slice(2)}`;

export const refsArrayToObject = (refArray) => {
  const [commonFooter, secondaryFooter] = refArray
    .filter((ref) => ref.type === CUSTOM_TYPES.FOOTER)
    .sort((a, b) => {
      if (a.data?.is_secondary_footer) return -1;
      if (b.data?.is_secondary_footer) return 1;
    });
  const [contentFramework] = refArray.filter(
    (ref) => ref.type === CUSTOM_TYPES.CONTENT_FRAMEWORK
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
  };
};
