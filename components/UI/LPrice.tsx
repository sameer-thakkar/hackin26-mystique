import React from 'react';

const LocalisedPrice = ({ price, currencySymbol, lang }) => {
  if (!price) return null;
  const lPrice = [currencySymbol, price];
  const reveresedList = ['de', 'it', 'fr'];
  return (
    <span>
      {reveresedList.includes(lang)
        ? lPrice.reverse().join('')
        : lPrice.join('')}
    </span>
  );
};
export default LocalisedPrice;
