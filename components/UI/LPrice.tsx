import React from 'react';
import Conditional from 'components/common/Conditional';
import { getLocalisedPrice, CurrencyDisplayType } from 'utils/currency';

type LocalisedPriceProps = {
  className?: string;
  currencyCode?: string;
  currencyDisplay?: CurrencyDisplayType;
  currencySymbol?: string;
  lang?: string;
  price: number;
  precision?: number;
  prefix?: string;
};

const LocalisedPrice = ({
  className = '',
  currencyCode,
  currencyDisplay = 'symbol',
  lang = 'en',
  price,
  precision = 2,
  prefix,
}: LocalisedPriceProps) => {
  const formattedPrice = getLocalisedPrice({
    price,
    currencyCode,
    lang,
    currencyDisplay,
    precision,
  });

  return (
    <span className={className}>
      <Conditional if={prefix}>
        <span className="prefix">{prefix}</span>
      </Conditional>
      <span className="strike-through"> {formattedPrice}</span>
    </span>
  );
};
export default LocalisedPrice;
