import {
  CURRENCY_SYMBOL_OVERRIDES,
  LESSER_KNOWN_CURRENCY_CODES,
} from 'const/currency';
import '@formatjs/intl-locale/polyfill';

export type CurrencyDisplayType = 'symbol' | 'code';

export type TCurrencyObj = {
  code: string;
  currency: string;
  currencyName: string;
  localSymbol: string;
  precision: number;
  symbol: string;
};

export type TGetLocalisedCurrencySymbol = {
  lang?: string;
  currencyCode: string;
  currencyDisplay: CurrencyDisplayType;
};

export type TGetLocalisedPrice = Omit<
  TGetLocalisedCurrencySymbol,
  'currencyDisplay'
> & {
  price: number;
  precision?: number;
  currencyList: Array<TCurrencyObj>;
  hideCurrency?: boolean;
};

export const getCurrencyObject = (
  currencyList: Array<TCurrencyObj>,
  currencyCode: string
) => {
  return currencyList.find((currency) => currency.code === currencyCode);
};

function getCurrencySymbol(
  currencyCode: string,
  language: string,
  currencyList: Array<TCurrencyObj>
): string | undefined {
  if (!currencyCode) return;
  const overrides = CURRENCY_SYMBOL_OVERRIDES[currencyCode];
  if (overrides && overrides[language]) {
    return overrides[language];
  } else {
    return getCurrencyObject(currencyList, currencyCode)?.localSymbol;
  }
}

/**
 * The `getLocalisedPrice` function formats a price value with the specified currency code and language, using the Intl.NumberFormat API.
 */
export const getLocalisedPrice = ({
  price,
  currencyCode,
  lang = 'en',
  precision = 2,
  currencyList,
  hideCurrency = false,
}: TGetLocalisedPrice) => {
  try {
    if ((!price && !isNaN(price)) || !currencyCode) return '';

    const isInteger = Number.isInteger(price);

    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'code',
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: isInteger ? 0 : precision,
    };

    const formatter = new Intl.NumberFormat(lang, formatOptions);

    const parts = formatter.formatToParts(price);

    // We want to keep the currencySymbol uniform across locales instead of the varying symbols that Web API provides.
    let formattedParts = parts.map((part) => {
      switch (part.type) {
        case 'currency':
          if (hideCurrency) {
            return ' ';
          }
          if (LESSER_KNOWN_CURRENCY_CODES.includes(part.value)) {
            return part.value;
          }
          return (
            getCurrencySymbol(currencyCode, lang, currencyList) ?? part.value
          );
        default:
          return part.value;
      }
    });

    const hasCurrencyCode = formattedParts.includes(currencyCode);

    /* This is done to remove any extra whitespace added by the Intl API when using the 'code' option for currency display. This applies ONLY for English and if the currency Symbol is present*/
    if (lang === 'en' && !hasCurrencyCode) {
      formattedParts = formattedParts.filter((p) => {
        const regex = /\s/;
        if (!regex.test(p)) {
          return p;
        }
      });
    }
    return formattedParts.join('');
  } catch (e) {
    return '';
  }
};

/**
 *
 * **Warning**: Intl accepts any 3 Character Code to be valid
 * this is not a comprehensive validation, (only way to know that is to check it against currency list API)
 * only ensures the currency code looks like its in ISO Standard.
 *
 */

type TCheckIfCurrencyCodeValid = {
  currencyCode: string;
};
export const checkIfCurrencyCodeValid = ({
  currencyCode,
}: TCheckIfCurrencyCodeValid) => {
  try {
    new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: currencyCode,
    }).format(0);
    return true;
  } catch (e) {
    return false;
  }
};

export const getLocalisedCurrencySymbol = ({
  lang,
  currencyCode,
  currencyDisplay,
}: TGetLocalisedCurrencySymbol) => {
  try {
    const numberFormat = new Intl.NumberFormat(lang, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay,
      minimumFractionDigits: 0,
    });
    const parts = numberFormat.formatToParts();

    const currency = parts.find((c) => c.type === 'currency');

    return currency?.value ?? currencyCode;
  } catch (e) {
    return '';
  }
};
