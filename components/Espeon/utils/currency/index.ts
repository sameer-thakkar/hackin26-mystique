import {
  CURRENCY_CODES_ORDER,
  CURRENCY_SYMBOL_OVERRIDES,
  LESSER_KNOWN_CURRENCY_CODES,
} from 'components/Espeon/constants/currency';
import type {
  TCurrencyOverrideCode,
  TGetLocalisedPrice,
  TLanguageOverrideCode,
} from 'components/Espeon/utils/currency/types';

export const getCurrencyObject = (
  currencyList: Array<any>,
  currencyCode: string
) => currencyList.find((currency) => currency.code === currencyCode);

function getCurrencySymbol(
  currencyCode: TCurrencyOverrideCode,
  language: TLanguageOverrideCode,
  currencyList: Array<any>
) {
  if (!currencyCode) return;
  const overrides = CURRENCY_SYMBOL_OVERRIDES[currencyCode];
  if (overrides && overrides[language as keyof typeof overrides]) {
    return overrides[language as keyof typeof overrides];
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
  currencyList = [],
  truncateIfLong,
  truncateAfter,
  hideCurrency = false,
}: TGetLocalisedPrice) => {
  try {
    if ((!price && !isNaN(price)) || !currencyCode) return '';

    const isInteger = Number.isInteger(price);

    const compactFormattingOptions: Intl.NumberFormatOptions = {
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    };

    const shouldTruncate =
      truncateIfLong && truncateAfter && price.toString().length > 3;

    /*
     * RangeError: maximumFractionDigits value is out of range.
     * This error happens if minimumFractionDigits > maximumFractionDigits
     */

    const fractionDigits = isInteger ? 0 : 2;
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'code',
      useGrouping: true,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
      ...(shouldTruncate && compactFormattingOptions),
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
            getCurrencySymbol(
              currencyCode as TCurrencyOverrideCode,
              lang as TLanguageOverrideCode,
              currencyList
            ) ?? part.value
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

export const currencySortFn = (currencyA: any, currencyB: any) =>
  CURRENCY_CODES_ORDER.indexOf(currencyA.code) -
  CURRENCY_CODES_ORDER.indexOf(currencyB.code);

export const getCurrencyList = (currenciesMap: any) =>
  Object.keys(currenciesMap).map((key) => currenciesMap[key]);
