export type CurrencyDisplayType = 'narrowSymbol' | 'code';

export const getLocalisedPrice = ({
  price,
  currencyCode,
  lang = 'en',
  currencyDisplay = 'narrowSymbol',
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
