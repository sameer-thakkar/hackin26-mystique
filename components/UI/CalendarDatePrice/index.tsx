import React from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { CalendarDatePriceProps } from 'components/UI/CalendarDatePrice/interface';
import {
  DateWrapper,
  PriceWrapper,
} from 'components/UI/CalendarDatePrice/styles';
import { getLocalisedPrice } from 'utils/currency';
import { currencyListAtom } from 'store/atoms/currencyList';

const CalendarDatePrice = ({
  date,
  currencyCode,
  lang = 'en',
  price,
  className = '',
}: CalendarDatePriceProps) => {
  const currencyList = useRecoilValue(currencyListAtom);
  const formattedPrice = getLocalisedPrice({
    price,
    currencyCode,
    lang,
    currencyList,
    hideCurrency: true,
  });

  return (
    <DateWrapper className={className}>
      <div className="date-label">{date}</div>
      <Conditional if={price}>
        <PriceWrapper>
          <span className="price">{formattedPrice}</span>
        </PriceWrapper>
      </Conditional>
    </DateWrapper>
  );
};
export default CalendarDatePrice;
