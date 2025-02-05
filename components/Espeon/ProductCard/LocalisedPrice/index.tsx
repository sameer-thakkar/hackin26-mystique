import React from 'react';
import Conditional from 'components/common/Conditional';
import { getLocalisedPrice } from 'components/Espeon/utils/currency';
import { localisedPriceStyles } from './styles';
import type { TLocalisedPrice } from './types';

const LocalisedPrice = ({
  className = '',
  currencyList,
  currencyCode,
  lang = 'en',
  price,
  prefix,
  truncateIfLong,
  truncateAfter,
  variant,
}: TLocalisedPrice) => {
  const formattedPrice = getLocalisedPrice({
    price,
    currencyCode,
    lang,
    currencyList,
    truncateIfLong,
    truncateAfter,
  });

  const { localisedPricePrefix, localisedPriceStrikeThrough } =
    localisedPriceStyles(variant);

  return (
    <span data-qa-marker="localised-price" className={className}>
      <Conditional if={!!prefix}>
        <span className={localisedPricePrefix}>{prefix}</span>
      </Conditional>
      <span className={localisedPriceStrikeThrough}>{formattedPrice}</span>
    </span>
  );
};

export default LocalisedPrice;
