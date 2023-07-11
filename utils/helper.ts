import type { NumberField, SelectField } from '@prismicio/types';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import parse from 'url-parse';
import { isMBDesign } from 'utils';
import { sendLog } from 'utils/logger';
import renderShortCodes from 'utils/shortCodes';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import {
  DESIGN,
  F1_SPORTS_EXPERIMENT_TGIDS,
  LANGUAGE_MAP,
  MB_CATEGORISATION,
} from 'const/index';
import { strings } from 'const/strings';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const withoutTrailingSlash = (url: string) =>
  url?.charAt(url?.length - 1) === '/' ? url?.substr(0, url.length - 1) : url;

export const withTrailingSlash = (url: any) =>
  url && url?.charAt(url?.length - 1) !== '/' ? `${url}/` : url;

export const isMobileDevice = () => {
  return document.documentElement.clientWidth < 768;
};

export const validateEmail = (email: string) => {
  let regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(String(email).toLowerCase());
};

export const validateFullName = (fullName: string) => {
  const parts = fullName.trim().split(' ');
  const hasAtLeastTwoParts = parts.length >= 2;
  let hasAtLeastOneNonInitial = false;
  for (const part of parts) {
    if (part.length > 1) {
      hasAtLeastOneNonInitial = true;
      break;
    }
  }

  return hasAtLeastTwoParts && hasAtLeastOneNonInitial;
};

export const isFieldSelected = (field: any) => !(field.length === 0);

export const isGroupValid = (
  adults: any,
  children: any,
  minPax: any,
  maxPax: any
) => {
  return +adults + +children < +minPax
    ? `* Minimum group size is ${minPax} (adult + children)`
    : +adults + +children > +maxPax
    ? `* Maximum group size is ${maxPax} (adult + children)`
    : '';
};

export const fetchUserGeoLocation = (url: any) =>
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      return json?.currentCountry?.code || '';
    })
    .catch((err) => {
      return err;
    });

export const createGroupBooking = (url: string, data: Record<string, any>) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(() => 'Successful')
    .catch((error) => `Error: ${error}`);
};

export const isMobile = () => document.documentElement.clientWidth < 768;

export const docCookies = {
  getItem: function (sKey: string | number | boolean) {
    if (!sKey) {
      return null;
    }
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
              encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
              '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null
    );
  },
  setItem: function (
    sKey: any,
    sValue: any,
    vEnd: any,
    sPath: any,
    sDomain: any,
    bSecure: any
  ) {
    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : '; max-age=' + vEnd;
          /*
          Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
          version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
          the end parameter might not work as expected. A possible solution might be to convert the the
          relative time to an absolute time. For instance, replacing the previous line with:
          */
          /*
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
          */
          break;
        case String:
          sExpires = '; expires=' + vEnd;
          break;
        case Date:
          sExpires = '; expires=' + vEnd.toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (bSecure ? '; secure' : '');
    return true;
  },
  removeItem: function (sKey: any, sPath: any, sDomain: any) {
    if (!this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '');
    return true;
  },
  hasItem: function (sKey: any) {
    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    return new RegExp(
      '(?:^|;\\s*)' +
        encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
        '\\s*\\='
    ).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie
      .replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },
};

export const getUID = (url: string) => {
  const { hostname, pathname } = parse(url, true);
  const uid = `${hostname}${withoutTrailingSlash(pathname).replace(
    /\//g,
    '.'
  )}`;
  return uid;
};

export const truncate = (string: string, length: number) => {
  if (string.length > length) return string.slice(0, length).trim() + '...';
  return string;
};

export const wordCount = (string = '') => string?.split(' ')?.length;

const slicesSorter = (a: Record<string, any>, b: Record<string, any>) => {
  if (a.slices && b.slices) return 0;
  else if (a.slices) {
    return 1;
  } else if (b.slices) {
    return -1;
  }
};
class Stack extends Array {
  peek() {
    return this[this.length - 1];
  }
}
const genClosingSlice = (slice_type: any) => ({
  slice_type: slice_type?.replace(/___start$/, '___end'),
});
const getOpeningSlice = (slice_type: any) => ({
  slice_type: slice_type.replace(/___end$/, '___start'),
});
const isClosingSlice = (slice_type: string) => /___end/.exec(slice_type);

const autoClose = (
  slices: Record<string, any>[],
  allowImmediateNesting: boolean
) => {
  const allSlices: Record<string, any>[] = [];
  const sliceTracker = new Stack();
  slices.forEach((slice) => {
    const thisSliceType = slice.slice_type;
    if (sliceTracker.peek() && !allowImmediateNesting) {
      if (thisSliceType === sliceTracker.peek()) {
        allSlices.push(genClosingSlice(sliceTracker.peek()));
        sliceTracker.pop();
      }
    }
    if (isClosingSlice(thisSliceType)) {
      if (thisSliceType === genClosingSlice(sliceTracker.peek()).slice_type)
        sliceTracker.pop();
      else {
        while (
          sliceTracker.peek() &&
          sliceTracker.indexOf(getOpeningSlice(thisSliceType).slice_type) >
            -1 &&
          thisSliceType !== genClosingSlice(sliceTracker.peek()).slice_type
        ) {
          allSlices.push({
            ...genClosingSlice(sliceTracker.peek()),
            by: 'loop',
          });
          sliceTracker.pop();
        }
        sliceTracker.pop();
      }
    }
    allSlices.push(slice);
    if (/___start$/.exec(thisSliceType)) {
      sliceTracker.push(thisSliceType);
    }
  });
  return allSlices;
};

export const groupSlices = (
  slices: Record<string, any>[],
  allowImmediateNesting = false
) => {
  const groups = { slices: [] };
  try {
    let ref: any = groups;
    const autoClosedSlices = autoClose(slices, allowImmediateNesting);
    let repeatables: Record<string, any> = {
      items: [],
    };
    autoClosedSlices.forEach((slice) => {
      if (/___repeatable$/.exec(slice.slice_type)) {
        repeatables.slice_type = slice.slice_type.replace(/___repeatable$/, '');
        repeatables.items = [...repeatables.items, { ...slice }];
        return;
      }
      if (/___start$/.exec(slice.slice_type)) {
        ref.slices.push({
          slices: [],
          slice_type: slice.slice_type.replace(/___start$/, ''),
          primary: slice.primary,
          items: slice.items,
          parent: ref,
        });
        ref = ref.slices[ref.slices.length - 1];
      } else if (/___end$/.exec(slice.slice_type)) {
        if (repeatables.slice_type !== undefined) {
          ref.slices.push({ ...repeatables });
          delete repeatables.slice_type;
          repeatables.items = [];
        }
        const temp = ref.parent;
        delete ref.parent;
        ref = temp;
        if (ref?.parent) ref.slices = ref.slices.sort(slicesSorter);
      } else {
        ref.slices.push(slice);
      }
    });
    return groups.slices;
  } catch (error) {
    sendLog({ err: error });
    return groups.slices;
  }
};

export const attachQueryParam = (
  url: string,
  queryString: string,
  replaceExistingParams = false
) => {
  if (url.includes('?')) {
    if (replaceExistingParams) {
      return `${url.split('?')[0]}?${queryString}`;
    }
    return `${url}&${queryString}`;
  }
  return `${url}?${queryString}`;
};

export const stringIdfy = (string: string) => {
  return string?.trim().replace(/\s/g, '-').toLowerCase();
};

export const csvTgidToArray = (csv: string) => {
  if (!csv) csv = '';
  return csv
    .split(',')
    .map((t) => parseInt(t.trim()))
    .filter((t) => t > 0);
};

export const genManualSlice = ({ type, items, primary, extras = {} }: any) => {
  return {
    slice_type: type,
    items,
    primary,
    extras,
  };
};

export const uaIsMobile = (userAgentString: any) =>
  /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(
    userAgentString
  );

export const getLangObject = (language: string) => {
  return (
    Object.values(LANGUAGE_MAP).find(
      (lang) => lang.locale === language || lang.code === language
    ) ?? LANGUAGE_MAP.en
  );
};

export const withShortcodes = (text: string = '') => {
  if (!text) return [];
  return renderShortCodes(text);
};

export const normaliseURL = (url = '') =>
  withoutTrailingSlash(url.replace(/http[s]?:\/\//g, ''));

export const isSameURL = (urlA = '', urlB = '') =>
  normaliseURL(urlA) === normaliseURL(urlB);

export const getHostName = (isStage: boolean, isDev: boolean, host: string) => {
  const isOnDemand = host.includes('mystique.test-headout.com');
  switch (true) {
    case (isDev && isStage) || isOnDemand:
      return `https://${host}`;
    case isDev:
      return `http://${host}`;
    default:
      return `https://${host}`;
  }
};

const compareDates = (
  startMonthDate: Dayjs,
  endMonthDate: Dayjs,
  startTourDate: Dayjs,
  endTourDate: Dayjs
) => {
  return (
    startTourDate.isSameOrBefore(startMonthDate, 'month') &&
    endTourDate.isSameOrAfter(endMonthDate, 'month')
  );
};

export const getTGIDListForMonth = (
  allTours: Record<string, any>,
  displayMonth: any
): Array<number> => {
  const allToursArray = Object.values(allTours);

  const startMonthDate = dayjs(
    `${displayMonth}/01/${dayjs().year()}`,
    'MMMM/DD/YYYY'
  );
  const endMonthDate = startMonthDate.add(
    startMonthDate.daysInMonth() - 1,
    'days'
  );
  const startMonthNextYearDate = startMonthDate.add(1, 'years');
  const endMonthNextYearDate = endMonthDate.add(1, 'years');

  return allToursArray.reduce((accumulator: any[], element) => {
    const endTourDate = dayjs((element as any)['closingDate'], 'YYYY-MM-DD');
    const startTourDate = dayjs(
      (element as any)['reopeningDate'],
      'YYYY-MM-DD'
    );
    if (
      compareDates(startMonthDate, endMonthDate, startTourDate, endTourDate) ||
      compareDates(
        startMonthNextYearDate,
        endMonthNextYearDate,
        startTourDate,
        endTourDate
      )
    ) {
      return [...accumulator, element['tgid']];
    }
    return accumulator;
  }, []);
};

export const getDiscountedProducts = (
  allTours: Record<string, any>
): number[] => {
  return Object.values(allTours)?.reduce(
    (acc: any[], product: Record<string, any>) => {
      const { listingPrice, tgid } = product;
      const { finalPrice, originalPrice } = listingPrice || {};
      if (listingPrice && (finalPrice < originalPrice || finalPrice < 30)) {
        return [...acc, tgid];
      }
      return acc;
    },
    []
  );
};

export const getPriceSortedDiscountedProducts = (
  allTours: Record<string, any>
) => {
  return Object.values(allTours)
    .sort((a: Record<string, any>, b: Record<string, any>) => {
      return a?.listingPrice?.finalPrice - b?.listingPrice?.finalPrice;
    })
    .reduce((acc: any[], product: Record<string, any>) => {
      const { listingPrice, tgid } = product;
      const { finalPrice, originalPrice } = listingPrice || {};
      if (listingPrice && (finalPrice < originalPrice || finalPrice < 30)) {
        return [...acc, tgid];
      }
      return acc;
    }, []);
};

export const getPriceSortedListicleTgids = (
  allTours: Record<string, any>,
  allowedTours: number[]
): number[] => {
  return Object.values(allTours)
    .sort((a: Record<string, any>, b: Record<string, any>) => {
      return a?.listingPrice?.finalPrice - b?.listingPrice?.finalPrice;
    })
    .filter(
      ({ listingPrice, tgid }: Record<string, any>) =>
        listingPrice && allowedTours.includes(tgid)
    )
    .map(({ tgid }: Record<string, any>) => tgid);
};

/**
 *
 * @param fn callback function
 * @param thresholdTriggerMs time interval in milliseconds after which fn needs to be called.
 * @returns
 */
export function throttle(callback: any, thresholdTriggerMs: any) {
  let lastTime = 0;
  return function (this: any) {
    let now = new Date().getTime();
    if (now - lastTime >= thresholdTriggerMs) {
      callback.apply(this, arguments);
      lastTime = now;
    }
  };
}

export const getBuyTicketsUrl = (
  supply: SelectField<'Direct' | 'Indirect' | 'No'>,
  categoryId: NumberField,
  tgid: NumberField,
  ticketsPageURL: string,
  isDev: boolean,
  host: string,
  officialWebsite: string,
  lang = 'en'
) => {
  const hasTicketsPage = supply === 'Direct' && categoryId;
  return hasTicketsPage
    ? ticketsPageURL
      ? convertUidToUrl({
          uid: ticketsPageURL,
          isDev,
          hostname: host,
          lang: lang,
        })
      : categoryId
      ? `https://headout.com/category/${categoryId}`
      : tgid
      ? `https://book.headout.com/tour/${tgid}`
      : getValidUrl(officialWebsite?.trim())
    : getValidUrl(officialWebsite?.trim());
};

export const checkIfLTTMB = (uid: string | null | undefined) =>
  !!uid?.includes('www.london-theater-tickets.com');

export const checkIfBroadwayMB = (uid: string | null | undefined) =>
  !!uid?.includes('www.broadway-show-tickets.com');

export const checkIfGpMotorTicketsMB = (uid: string | null | undefined) =>
  !!uid?.includes('gpmotorsportstickets.com') ||
  !!uid?.includes('f1-baku-tickets.com') ||
  !!uid?.includes('f1-miami-tickets.com');

export const checkIfSportsSubCategory = (
  primarySubcategoryId: number | undefined | null
) => primarySubcategoryId === 1042 || primarySubcategoryId === 1109;

export const checkIfCategoryHeaderExists = ({
  mbDesign,
  mbType,
}: {
  mbDesign: string | undefined | null;
  mbType: string | undefined | null;
}) => {
  const supportedMbTypes = [
    MB_CATEGORISATION.MB_TYPE.C1_COLLECTION,
    MB_CATEGORISATION.MB_TYPE.A1_COLLECTION,
    MB_CATEGORISATION.MB_TYPE.A1_HOMEPAGE,
    MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
    MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
    MB_CATEGORISATION.MB_TYPE.A1_CITY_GUIDE,
    MB_CATEGORISATION.MB_TYPE.A2_CATEGORY,
    MB_CATEGORISATION.MB_TYPE.A2_SUB_CATEGORY,
  ];
  return (
    isMBDesign({
      currentDesign: mbDesign || '',
      expectedDesign: [DESIGN.V1, DESIGN.V3],
    }) && supportedMbTypes.includes(mbType || '')
  );
};

export const getCategoryHeaderMenuLabel = ({
  label,
  mbCity,
}: {
  label: string;
  mbCity: string;
}) => {
  const formattedLabel = strings.formatString(
    strings.CATEGORY_HEADER[label as keyof typeof strings.CATEGORY_HEADER],
    mbCity
  );
  const formattedLabelString = Array.isArray(formattedLabel)
    ? formattedLabel[0]
    : formattedLabel;
  return formattedLabelString || label;
};

export const isF1SportsExperiment = (tgid: number): boolean =>
  F1_SPORTS_EXPERIMENT_TGIDS.includes(String(tgid));

export const generateSidenavId = (heading: string) => {
  return `sidenav-${stringIdfy(heading)}`;
};
