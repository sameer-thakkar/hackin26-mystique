export const getLocalisedPrice = ({
  price,
  currencyCode,
  lang = 'en',
}: {
  price: number;
  currencyCode: string;
  lang?: string;
}) =>
  new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
