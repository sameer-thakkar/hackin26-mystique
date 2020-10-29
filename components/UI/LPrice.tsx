import React from 'react';

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
  return (
    <span className={className}>
      {reveresedList.includes(lang)
        ? lPrice.reverse().join(' ')
        : lPrice.join('')}
    </span>
  );
};
export default LocalisedPrice;
