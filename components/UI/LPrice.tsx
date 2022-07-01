import React from 'react';
import { getLocalisedPrice, CurrencyDisplayType } from 'utils/currency';

type LocalisedPriceProps = {
  className?: string;
  currencyCode?: string;
  currencyDisplay?: CurrencyDisplayType;
  currencySymbol?: string;
  lang?: string;
  price: number;
  precision?: number;
};

const LocalisedPrice = ({
  className = '',
  currencyCode,
  currencyDisplay = 'narrowSymbol',
  lang = 'en',
  price,
  precision = 2,
}: LocalisedPriceProps) => {
  const formattedPrice = getLocalisedPrice({
    price,
    currencyCode,
    lang,
    currencyDisplay,
    precision,
  });

  return <span className={className}>{formattedPrice}</span>;
};
export default LocalisedPrice;
