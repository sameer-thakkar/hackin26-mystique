import React from 'react';
import { getLocalisedPriceString } from 'utils/helper';

const LocalisedPrice = ({
  price,
  currencySymbol,
  lang,
  className = '',
  precision = 2,
}) => {
  const finalPrice = getLocalisedPriceString(
    price,
    currencySymbol,
    lang,
    precision
  );
  return <span className={className}>{finalPrice}</span>;
};
export default LocalisedPrice;
