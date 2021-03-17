import React from 'react';
import { isAlphabeticString } from 'utils/stringUtils';

const LocalisedPrice = ({
  price,
  currencySymbol,
  lang,
  className = '',
  precision = 2,
}) => {
  if (!price) return null;
  const reveresedList = ['de', 'it', 'fr'];
  const useCommaList = ['de', 'fr', 'pt'];
  let finalPrice = price % 1 > 0 ? price.toFixed(precision) : price;
  finalPrice = useCommaList.includes(lang)
    ? finalPrice.toString().replace('.', ',')
    : finalPrice;
  const lPrice = [currencySymbol, finalPrice];
  const space = isAlphabeticString(currencySymbol) ? ' ' : '';
  return (
    <span className={className}>
      {reveresedList.includes(lang)
        ? lPrice.reverse().join(' ')
        : lPrice.join(space)}
    </span>
  );
};
export default LocalisedPrice;
