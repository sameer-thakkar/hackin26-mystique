import parse from 'url-parse';
import { parsePhoneNumberFromString as parseMobile } from 'libphonenumber-js/mobile';

export const withoutTrailingSlash = (url) =>
  url.charAt(url.length - 1) === '/' ? url.substr(0, url.length - 1) : url;

export const isMobileDevice = () => {
  return document.documentElement.clientWidth < 768;
};

export const validateEmail = (email) => {
  let regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(String(email).toLowerCase());
};

export const validateFullName = (fullName) => {
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

export const isFeildSelected = (field) => !(field.length === 0);

export const isGroupValid = (adults, children, minPax, maxPax) => {
  return +adults + +children < +minPax
    ? `* Minimum group size is ${minPax} (adult + children)`
    : +adults + +children > +maxPax
    ? `* Maximum group size is ${maxPax} (adult + children)`
    : '';
};

export const checkPhoneNumberValidity = (phoneWithCountryCode) => {
  const { phone, countryDialCode } = phoneWithCountryCode;
  if (phone === countryDialCode || !countryDialCode || !phone) {
    return false;
  }
  if (phone.length >= 18 || phone.length <= countryDialCode.length) {
    return false;
  }
  // Indian Exception for number starting with 6
  if (phone.replace(/\D+/g, '').startsWith('+916')) {
    return true;
  }
  if (phone && parseMobile(`${phone}`)) {
    return parseMobile(`${phone}`).isValid();
  }
  return false;
};

export const fetchUserGeoLocation = (url) =>
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      return json.country;
    })
    .catch((err) => {
      return err;
    });

export const createGroupBooking = (url, data) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(() => 'Successful')
    .catch((error) => `Error: ${error}`);
};
export const isMobile = () => {
  return document.documentElement.clientWidth < 768;
};

export const docCookies = {
  getItem: function (sKey) {
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
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
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
  removeItem: function (sKey, sPath, sDomain) {
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
  hasItem: function (sKey) {
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

export const getUID = (url) => {
  const { hostname, pathname } = parse(url, true);
  const uid = `${hostname}${withoutTrailingSlash(pathname).replace(
    /\//g,
    '.'
  )}`;
  return uid;
};

export const truncate = (string, length) => {
  if (string.length > length) return string.slice(0, length).trim() + '...';
  return string;
};

const slicesSorter = (a, b) => {
  if (a.slices && b.slices) return 0;
  else if (a.slices) {
    return 1;
  } else if (b.slices) {
    return -1;
  }
};
const autoClose = (slices) => {
  const allSlices = [];
  let currentOpen;
  slices.forEach((slice) => {
    if (currentOpen) {
      const thisSliceType = slice.slice_type;
      const currentCloseSignature = currentOpen.replace(/___start$/, '___end');
      const isManuallyClosedSlice = thisSliceType === currentCloseSignature;
      const isClosingSlice = /___end/.exec(slice.slice_type);
      // Ignore Manual Closed, Check if adjacent (same level) slice was opened or parent closed.
      if (
        !isManuallyClosedSlice &&
        (thisSliceType === currentOpen || isClosingSlice)
      ) {
        // TODO: Start using stack to keep track of opened sections (below, hack for closing multi-level open sections
        const isAlreadyClosed =
          allSlices[allSlices.length - 1].slice_type === currentCloseSignature;
        if (!isAlreadyClosed)
          allSlices.push({
            slice_type: currentOpen.replace(/___start$/, '___end'),
          });
      }
    }
    allSlices.push(slice);
    if (/___start$/.exec(slice.slice_type)) {
      currentOpen = slice.slice_type;
    }
  });
  return allSlices;
};

export const groupSlices = (slices) => {
  const groups = { slices: [] };
  let ref: any = groups;
  const autoClosedSlices = autoClose(slices);
  let repeatables: any = {
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
      if (ref.parent) ref.slices = ref.slices.sort(slicesSorter);
    } else {
      ref.slices.push(slice);
    }
  });
  return groups.slices;
};

export const attachQueryParam = (
  url,
  queryString,
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

export const stringIdfy = (string) => {
  return string.trim().replace(/\s/g, '-').toLowerCase();
};

export const csvTgidToArray = (csv) => {
  if (!csv) csv = '';
  return csv
    .split(',')
    .map((t) => parseInt(t.trim()))
    .filter((t) => t > 0);
};
