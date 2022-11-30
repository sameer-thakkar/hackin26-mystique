export type CurrencyDisplayType = 'symbol' | 'code';

export const getLocalisedPrice = ({
  price,
  currencyCode,
  lang = 'en',
  currencyDisplay = 'symbol',
  precision = 2,
}: {
  price: number;
  currencyCode: string;
  currencyDisplay?: CurrencyDisplayType;
  lang?: string;
  precision?: number;
}) => {
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
export const checkIfCurrencyCodeValid = ({ currencyCode }) => {
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
}: {
  currencyCode: string;
  currencyDisplay?: CurrencyDisplayType;
  lang?: string;
}) => {
  const numberFormat = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay,
    minimumFractionDigits: 0,
  });
  const currencyString = numberFormat
    .formatToParts()
    .find((c) => c.type === 'currency').value;

  return currencyString;
};
