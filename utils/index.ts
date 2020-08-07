import Router from 'next/router';
import { withoutTrailingSlash } from '../utils/helper';
import dayjs from 'dayjs';
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_MAP } from '../constants';

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

export const createBookingURL = ({ lang, nakedDomain, tgid, df = false }) => {
  let query = '';
  query += df ? '?isDiscountedFutures=1' : '';
  return (
    [
      'https://',
      `book.${nakedDomain}`,
      lang && lang !== 'en' ? lang : null,
      'book',
      tgid,
    ]
      .filter((k) => k)
      .join('/') + query
  );
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
