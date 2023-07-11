import React from 'react';
import Conditional from 'components/common/Conditional';
import { CurrencyDisplayType, getLocalisedPrice } from 'utils/currency';

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
    // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
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
