import { CASHBACK_TYPES } from 'const/index';
import { ListingPrice } from './interface';

export const hasDiscountElementAndCashbackElement = (
  listingPrice: ListingPrice
) => {
  const { cashbackValue, cashbackType, bestDiscount } = listingPrice ?? {};

  const showCashbackElement =
    cashbackValue > 0 && cashbackType === CASHBACK_TYPES.PERCENTAGE;
  const hasDiscountElement = bestDiscount > 0 || showCashbackElement;

  return {
    hasDiscountElement,
    showCashbackElement,
  };
};
