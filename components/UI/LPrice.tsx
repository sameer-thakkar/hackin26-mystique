import React from 'react';

const LocalisedPrice = ({ price, currencySymbol, lang, className = '' }) => {
  if (!price) return null;
  const lPrice = [currencySymbol, price];
  const reveresedList = ['de', 'it', 'fr'];
  return (
    <span className={className}>
      {reveresedList.includes(lang)
        ? lPrice.reverse().join('')
        : lPrice.join('')}
    </span>
  );
};
export default LocalisedPrice;
