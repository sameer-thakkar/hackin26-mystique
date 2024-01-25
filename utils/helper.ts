import type { KeyTextField, NumberField, SelectField } from '@prismicio/types';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Simplify } from 'types.prismic';
import parse from 'url-parse';
import {
  getHeadoutLanguagecode,
  isCategoryMB,
  isCollectionMB,
  isMBDesign,
  isSubCategoryMB,
} from 'utils';
import { fetchCategory } from 'utils/apiUtils';
import { sendLog } from 'utils/logger';
import { getStructure } from 'utils/lookerUtils';
import renderShortCodes from 'utils/shortCodes';
import { constantCase } from 'utils/stringUtils';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import { AIRPORT_TRANSFER_PRIMARY_SUBCATEGORY_ID } from 'const/airportTransfers';
import { CATEGORY_BANNER, SUB_CATEGORY_BANNER } from 'const/bannerDescriptors';
import { A2_SHOULDER_PAGE_TYPES, SHOW_NAME_TICKETS } from 'const/breadcrumbs';
import { MISC, SUB_ATTRACTIONS } from 'const/header';
import {
  BANNER_API_PARAMS,
  CATEGORY_IDS,
  CUSTOM_TYPES,
  DESIGN,
  ENTITY_ICONS_FOLDER_URL,
  F1_SPORTS_EXPERIMENT_TGIDS,
  LANGUAGE_MAP,
  MB_CATEGORISATION,
  MONTHS,
  PAGE_URL_STRUCTURE,
  SUBCATEGORY,
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
  // remove lang path
  let modifiedPathname = pathname.replace(/^\/\w{2}(?=\/|$)/, '');
  const uid = `${hostname}${withoutTrailingSlash(modifiedPathname).replace(
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
  if (sliceTracker.peek()) {
    allSlices.push(genClosingSlice(sliceTracker.peek()));
    sliceTracker.pop();
  }
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

export const csvTgidToArray = (csv: string | KeyTextField | undefined) => {
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

export const withShortcodes = (text: string = '', props = {}) => {
  if (!text) return [];
  return renderShortCodes(text, props);
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

export const getNextOccurrenceYear = (targetMonthName: string) => {
  const currentYear = dayjs().year();
  const currentMonthName = dayjs().format('MMMM');

  const targetMonthIndex = MONTHS.findIndex(
    (month: string) => month.toLowerCase() === targetMonthName.toLowerCase()
  );

  if (targetMonthIndex === -1) {
    // Month name not found
    return -1;
  }

  const currentMonthIndex = MONTHS.findIndex(
    (month: string) => month.toLowerCase() === currentMonthName.toLowerCase()
  );

  if (targetMonthIndex >= currentMonthIndex) {
    // If the target month is ahead or the same as the current month in this year
    return currentYear;
  } else {
    // If the target month is ahead in the next year
    return currentYear + 1;
  }
};

export const isTargetMonthInBetweenTargetDates = (
  start: Dayjs,
  end: Dayjs,
  targetYear: number,
  targetMonth: number
) => {
  dayjs.extend(isBetween);
  // Get the first date of the target month
  const firstDateOfMonth = dayjs(new Date(targetYear, targetMonth, 1));
  // Get the last date of the target month
  const lastDateOfMonth = dayjs(firstDateOfMonth).endOf('month');

  return (
    firstDateOfMonth.isBetween(start, end) ||
    lastDateOfMonth.isBetween(start, end)
  );
};

export const padSingleDigit = (number: number) => {
  // Check if the number is less than 10
  if (number < 10) {
    // If the number is a single digit, add a preceding zero
    return `0${number}`;
  }
  // If the number is already two digits or more, return it as is
  return `${number}`;
};

export const getTGIDListForMonth = (
  allTours: Record<string, any>,
  displayMonth: any
): Array<number> => {
  const allToursArray = Object.values(allTours);
  const targetYear = getNextOccurrenceYear(displayMonth);

  return allToursArray.reduce((accumulator: any[], element) => {
    const endTourDate = dayjs((element as any)['closingDate'], 'YYYY-MM-DD');
    const startTourDate = dayjs(
      (element as any)['reopeningDate'],
      'YYYY-MM-DD'
    );
    const targetMonthIndex = MONTHS.findIndex(
      (month: string) => month.toLowerCase() === displayMonth.toLowerCase()
    );
    const paddedMonthIndex = Number(padSingleDigit(targetMonthIndex));

    if (
      isTargetMonthInBetweenTargetDates(
        startTourDate,
        endTourDate,
        targetYear,
        paddedMonthIndex
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
      if (listingPrice && finalPrice < originalPrice) {
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

export const checkIfLTTMBLandingPage = (uid: string | null | undefined) =>
  uid === 'www.london-theater-tickets.com';

export const checkIfBroadwayMB = (uid: string | null | undefined) =>
  !!uid?.includes('www.broadway-show-tickets.com');

export const checkIfViennaConcertMB = (uid: string | null | undefined) =>
  !!uid?.includes('www.vienna-concert-tickets.com');

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

export const checkIfCatOrSubCatPage = async <T>(
  doc: Simplify<T>,
  baseLangCategorisationMetadata?: TCategorisationMetadata
): Promise<boolean> => {
  // @ts-ignore
  const { type, data, lang, uid } = doc ?? {};

  if (type !== CUSTOM_TYPES.MICROSITE) return false;

  const pageUrl = convertUidToUrl({
    uid,
    lang: getHeadoutLanguagecode(lang),
  });
  const url = new URL(pageUrl);
  const isSubdomain =
    getStructure(url) === PAGE_URL_STRUCTURE.SUBDOMAIN ||
    getStructure(url) === PAGE_URL_STRUCTURE.SUBDOMAIN_SUBFOLDER;

  if (isSubdomain) return false;

  const finalBaseLangCategorisationMetadata =
    data?.baseLangCategorisationMetadata || baseLangCategorisationMetadata;

  const {
    tagged_city: taggedCity,
    tagged_mb_type: taggedMbType,
    tagged_page_type: taggedPageType,
    tagged_category: taggedCategory,
  } = finalBaseLangCategorisationMetadata || {};

  const allowedMBTypes = [
    MB_CATEGORISATION.MB_TYPE.A1_CATEGORY,
    MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY,
  ];

  const baseConditions =
    allowedMBTypes.includes(taggedMbType) &&
    taggedPageType === MB_CATEGORISATION.PAGE_TYPE.LANDING_PAGE &&
    taggedCategory === MB_CATEGORISATION.CATEGORY.TICKETS &&
    !!taggedCity;

  if (!baseConditions) return false;

  let categoryApiData: Record<string, any> = {};
  try {
    categoryApiData = await fetchCategory({
      city: taggedCity,
      language: getHeadoutLanguagecode(lang),
    });
  } catch (err) {
    sendLog({
      err,
      message: `[checkIfCatOrSubCatPage] - 
      ${JSON.stringify({
        taggedCity,
        taggedCategory,
        taggedPageType,
        taggedMbType,
        lang,
      })}
    `,
    });
    return false;
  }
  const { categories } = categoryApiData;
  const categoryData = categories?.find(
    (category: Record<string, any>) => category.name === taggedCategory
  );

  if (taggedMbType === MB_CATEGORISATION.MB_TYPE.A1_CATEGORY && categoryData) {
    return true;
  }

  if (taggedMbType === MB_CATEGORISATION.MB_TYPE.A1_SUB_CATEGORY) {
    const { subCategories } = categoryData;
    const { tagged_sub_category: taggedSubCategory } =
      finalBaseLangCategorisationMetadata || {};

    if (taggedSubCategory === SUBCATEGORY.CITY_CARDS) return false;

    return subCategories?.some(
      (subCategory: Record<string, any>) =>
        subCategory.name === taggedSubCategory
    );
  }

  return false;
};

export const getSubCategoryIconUrl = (
  subCategoryId: number | undefined | null
) => {
  if (!subCategoryId) return `${ENTITY_ICONS_FOLDER_URL}/cat_1.svg`;
  return `${ENTITY_ICONS_FOLDER_URL}/sub_${subCategoryId}.svg`;
};

export const getCatAndSubcatPageLabel = ({
  label,
  replacementString = '',
}: {
  label: string;
  replacementString?: string;
}) => {
  const formattedLabel = strings.formatString(
    strings.CAT_SUBCAT_PAGE[label as keyof typeof strings.CAT_SUBCAT_PAGE],
    replacementString
  );
  const formattedLabelString = Array.isArray(formattedLabel)
    ? formattedLabel[0]
    : formattedLabel;
  return formattedLabelString || label;
};

export const getBannerDescriptors = ({
  taggedMbType,
  taggedCategoryName,
  taggedSubCategoryName,
  firstProductSubCategory,
}: {
  taggedMbType: string | null;
  taggedCategoryName: string | null;
  taggedSubCategoryName: string | null;
  firstProductSubCategory: Record<string, any> | undefined;
}) => {
  const { id, name } = firstProductSubCategory || {};

  const isAirportTransfersMB =
    (name === 'Private Airport Transfers' || name === 'Airport Transfers') &&
    taggedSubCategoryName === 'Airport Transfers';

  let descriptorData = [];

  if (isAirportTransfersMB) {
    descriptorData = SUB_CATEGORY_BANNER()[
      AIRPORT_TRANSFER_PRIMARY_SUBCATEGORY_ID
    ];
  } else if (isSubCategoryMB(taggedMbType) && taggedSubCategoryName === name) {
    descriptorData = SUB_CATEGORY_BANNER()[id];
  } else if (isCategoryMB(taggedMbType) && taggedCategoryName) {
    const categoryId = CATEGORY_IDS[taggedCategoryName];
    descriptorData = CATEGORY_BANNER()[categoryId];
  } else if (isCollectionMB(taggedMbType) && taggedSubCategoryName === name) {
    descriptorData = SUB_CATEGORY_BANNER()[id];
  } else if (isCollectionMB(taggedMbType) && taggedCategoryName) {
    const categoryId = CATEGORY_IDS[taggedCategoryName];
    descriptorData = CATEGORY_BANNER()[categoryId];
  }
  return descriptorData;
};

export const getShoulderPageLabel = ({
  shoulderPageType,
  shoulderPageCustomLabel,
}: {
  shoulderPageType: string;
  shoulderPageCustomLabel: string;
}) => {
  if (shoulderPageType === MISC || shoulderPageType === SUB_ATTRACTIONS) {
    return shoulderPageCustomLabel || '';
  } else if (Object.keys(A2_SHOULDER_PAGE_TYPES).includes(shoulderPageType)) {
    return A2_SHOULDER_PAGE_TYPES[
      shoulderPageType as keyof typeof A2_SHOULDER_PAGE_TYPES
    ];
  } else {
    return shoulderPageCustomLabel || shoulderPageType || '';
  }
};

export const getBreadcrumbLabel = ({
  label,
  mbCity,
  showName,
}: {
  label: string;
  mbCity: string;
  showName: string;
}) => {
  let formattedLabel;

  if (label === SHOW_NAME_TICKETS) {
    formattedLabel = strings.formatString(
      strings.BREADCRUMBS[label as keyof typeof strings.BREADCRUMBS],
      showName
    );
  } else {
    formattedLabel =
      strings.formatString(
        strings.BREADCRUMBS[label as keyof typeof strings.BREADCRUMBS],
        mbCity
      ) ||
      strings.formatString(
        strings.CATEGORY_HEADER[
          constantCase(label) as keyof typeof strings.CATEGORY_HEADER
        ],
        mbCity
      );
  }
  const formattedLabelString = Array.isArray(formattedLabel)
    ? formattedLabel[0]
    : formattedLabel;

  return formattedLabelString || label;
};

export const getScrollPercentage = (percentage: number) => {
  let scrollPercentage = null;

  if (20 < percentage && percentage < 30) {
    scrollPercentage = 25;
  } else if (45 < percentage && percentage < 55) {
    scrollPercentage = 50;
  } else if (70 < percentage && percentage < 80) {
    scrollPercentage = 75;
  } else if (90 < percentage && percentage < 100) {
    scrollPercentage = 90;
  }

  return scrollPercentage;
};

export const findVideoUrlFromMediaData = (media: Record<string, any>[]) => {
  return media?.find((item) => item?.type === BANNER_API_PARAMS.ELM_TYPE.VIDEO)
    ?.url;
};
