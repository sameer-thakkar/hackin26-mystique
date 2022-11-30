import { CURRENCY_CODES_ORDER, LOCALE_ORDER } from 'const/index';

export const fromEntries = (iterable) =>
  [...iterable].reduce(
    (obj, [key, val]) => Object.assign(obj, { [key]: val }),
    {}
  );

export const hashCode = (input) => {
  let hash = 0;
  if (input.length === 0) return hash;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
};

export const isServer = () => {
  return typeof window === 'undefined';
};

/**
 *
 * @param req request object inside getInitialProps
 * @returns isMobile boolean value determined from the userAgent
 */
export const localServerSideIsMobileCheck = (req) => {
  let userAgent;
  if (req) {
    userAgent = req.headers['user-agent']; // Server
  } else {
    userAgent = navigator.userAgent; // Client
  }

  const isMobile = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );

  return isMobile;
};

export const localeSortFn = (localeA, localeB) =>
  LOCALE_ORDER.indexOf(localeA.code) - LOCALE_ORDER.indexOf(localeB.code);

export const currencySortFn = (currencyA, currencyB) =>
  CURRENCY_CODES_ORDER.indexOf(currencyA.code) -
  CURRENCY_CODES_ORDER.indexOf(currencyB.code);

export function debounce(func, wait, immediate = false) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}
