import React from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { getLocalisedPrice } from 'utils/currency';
import { currencyListAtom } from 'store/atoms/currencyList';

type LocalisedPriceProps = {
  className?: string;
  currencyCode: string;
  currencySymbol?: string;
  lang?: string;
  price: number;
  precision?: number;
  prefix?: string;
};

const LocalisedPrice = ({
  className = '',
  currencyCode,
  lang = 'en',
  price,
  precision = 2,
  prefix,
}: LocalisedPriceProps) => {
  const currencyList = useRecoilValue(currencyListAtom);
  const formattedPrice = getLocalisedPrice({
    price,
    currencyCode,
    lang,
    precision,
    currencyList,
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
