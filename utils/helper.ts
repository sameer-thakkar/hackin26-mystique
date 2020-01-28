import { parsePhoneNumberFromString as parseMobile } from 'libphonenumber-js/mobile';
import parse from 'url-parse';

export const withoutTrailingSlash = url =>
    url.charAt(url.length - 1) === '/' ? url.substr(0, url.length - 1) : url;

export const isMobileDevice = () => {
    return document.documentElement.clientWidth < 768;
};
export const validateEmail = email => {
    let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(String(email).toLowerCase());
};
export const validateFullName = fullName => {
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

export const isFeildSelected = field => !(field.length === 0);

export const isGroupValid = (adults, children, minPax, maxPax) => {
    return +adults + +children < +minPax
        ? `* Minimum group size is ${minPax} (adult + children)`
        : +adults + +children > +maxPax
        ? `* Maximum group size is ${maxPax} (adult + children)`
        : '';
};

export const checkPhoneNumberValidity = phoneWithCountryCode => {
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

export const fetchUserGeoLocation = url =>
    fetch(url)
        .then(response => response.json())
        .then(json => {
            return json.country;
        })
        .catch(err => {
            return err;
        });

export const createGroupBooking = (url, data) =>
    fetch(url, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
    })
        .then(response => 'Successful')
        .catch(error => `Error: ${error}`);

export const isMobile = () => {
    return document.documentElement.clientWidth < 768;
};

export const docCookies = {
    getItem: function(sKey) {
        if (!sKey) {
            return null;
        }
        return (
            decodeURIComponent(
                document.cookie.replace(
                    new RegExp(
                        '(?:(?:^|.*;)\\s*' +
                            encodeURIComponent(sKey).replace(
                                /[\-\.\+\*]/g,
                                '\\$&'
                            ) +
                            '\\s*\\=\\s*([^;]*).*$)|^.*$'
                    ),
                    '$1'
                )
            ) || null
        );
    },
    setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
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
    removeItem: function(sKey, sPath, sDomain) {
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
    hasItem: function(sKey) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        return new RegExp(
            '(?:^|;\\s*)' +
                encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') +
                '\\s*\\='
        ).test(document.cookie);
    },
    keys: function() {
        var aKeys = document.cookie
            .replace(
                /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,
                ''
            )
            .split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    },
};

export const getUID = url => {
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

export const attachQueryParam = (url, queryString) => {
    if (url.includes('?')) {
        return `${url}&${queryString}`;
    }
    return `${url}?${queryString}`;
};

// Reflects promises to avoid running into the catch block
export const reflect = promise =>
    promise.then(
        payload => ({ payload, status: 'resolved' }),
        error => ({ error, status: 'rejected' })
    );
