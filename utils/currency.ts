export type CurrencyDisplayType = 'symbol' | 'code';

export type TGetLocalisedCurrencySymbol = {
  lang?: string;
  currencyCode: string;
  currencyDisplay?: CurrencyDisplayType;
};

export type TGetLocalisedPrice = TGetLocalisedCurrencySymbol & {
  price: number;
  precision?: number;
};

export const getLocalisedPrice = ({
  price,
  currencyCode,
  lang = 'en',
  currencyDisplay = 'symbol',
  precision = 2,
}: TGetLocalisedPrice) => {
  if (!price && !currencyCode) return '';
  const isInteger = Number.isInteger(price);
  const localisedPrice = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay,
    minimumFractionDigits: isInteger ? 0 : precision,
  }).format(price);
  return localisedPrice;
};

/**
 *
 * **Warning**: Intl accepts any 3 Character Code to be valid
 * this is not a comprehensive valiadtion, (only way to know that is to check it against currency list API)
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
  const numberFormat = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay,
    minimumFractionDigits: 0,
  });
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const currencyString = numberFormat
    .formatToParts()
    .find((c) => c.type === 'currency').value;

  return currencyString;
};
