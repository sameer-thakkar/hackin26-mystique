import { getLocalisedPrice } from 'utils/currency';

type MinPriceProps = {
  minPrice: number;
  currencyCode: string;
  currencyList: [];
};

/**
 *
 * Use the `min-price` shortcode to render the minimum listing price, retrieved from the rendered products in the page
 *
 */
const MinPrice = (_: any, props: MinPriceProps) => {
  const { currencyCode, currencyList, minPrice: price } = props;

  if (!price) return '';

  const LocalisedPrice = getLocalisedPrice({
    currencyCode,
    currencyList,
    price,
  });
  return LocalisedPrice;
};

export default MinPrice;
