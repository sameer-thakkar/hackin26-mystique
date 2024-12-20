import { CURRENCY_CODES_ORDER } from 'const/currency';
import { LOCALE_ORDER } from 'const/index';

export const fromEntries = (iterable: any) =>
  [...iterable].reduce(
    (obj, [key, val]) => Object.assign(obj, { [key]: val }),
    {}
  );

export const hashCode = (input: string) => {
  let hash = 0;
  if (input.length === 0) return hash;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
};

export const isServer = () => typeof window === 'undefined';
export const isProduction = () => process.env.NODE_ENV === 'production';
/**
 *
 * @param req request object inside getInitialProps
 * @returns isMobile boolean value determined from the userAgent
 */
export const localServerSideIsMobileCheck = (req: any) => {
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

export const localeSortFn = (
  localeA: Record<string, any>,
  localeB: Record<string, any>
) => LOCALE_ORDER.indexOf(localeA.code) - LOCALE_ORDER.indexOf(localeB.code);

type TCurrencyObj = {
  code: string;
  currencyName: string;
  symbol: string;
  localSymbol: string;
  precision: number;
  currency: string;
};

export const currencySortFn = (
  currencyA: TCurrencyObj,
  currencyB: TCurrencyObj
) =>
  CURRENCY_CODES_ORDER.indexOf(currencyA.code) -
  CURRENCY_CODES_ORDER.indexOf(currencyB.code);

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  callback: F,
  wait: number,
  immediate = false
) {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function <U>(this: U, ...args: Parameters<typeof callback>) {
    let context = this;

    const later = () => {
      timeout = null;

      if (!immediate) {
        callback.apply(context, args);
      }
    };

    if (typeof timeout === 'number') {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (immediate && !timeout) callback.apply(context, args);
  };
}

/**
 *
 * @param fn callback function
 * @param thresholdTriggerMs time interval in milliseconds after which fn needs to be called.
 * @returns
 */
export function throttle<F extends (...args: Parameters<F>) => ReturnType<F>>(
  callback: F,
  thresholdTriggerMs: number
) {
  let lastTime = 0;
  return function <U>(this: U, ...args: Parameters<typeof callback>) {
    let now = new Date().getTime();
    if (now - lastTime >= thresholdTriggerMs) {
      callback.apply(this, args);
      lastTime = now;
    }
  };
}

export const addToNestedObject = (
  nestedObject: Record<any, any>,
  targetKey: keyof typeof nestedObject,
  objectToAdd: Record<any, any>
) => {
  for (const key in nestedObject) {
    if (key === targetKey) {
      nestedObject[key] = {
        ...nestedObject[key],
        [objectToAdd.label]: objectToAdd,
      };
      return;
    } else if (typeof nestedObject[key] === 'object') {
      addToNestedObject(nestedObject[key], targetKey, objectToAdd);
    }
  }
};

export const sortObjectByKeys = ({
  obj,
  order,
}: {
  obj: Record<string, any>;
  order: string[];
}) => {
  const sortedObj: Record<string, any> = {};

  order.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sortedObj[key] = obj[key];
    }
  });

  Object.keys(obj).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(sortedObj, key)) {
      sortedObj[key] = obj[key];
    }
  });

  return sortedObj;
};

export const getObjectNestingCount = (
  obj: Record<string, any>,
  level = 0
): number => {
  if (typeof obj !== 'object' || obj === null) {
    return level;
  }
  return Math.max(
    ...Object.values(obj).map((val) => getObjectNestingCount(val, level + 1))
  );
};

export const onEnterKeyPress = (
  e: React.KeyboardEvent,
  callbackFunction: Function,
  ...args: any[]
) => {
  if (e.key === 'Enter') callbackFunction(...args);
};
