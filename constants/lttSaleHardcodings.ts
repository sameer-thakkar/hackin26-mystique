import { strings } from 'const/strings';

export const LTT_SALE_HARDCODINGS: Record<
  string,
  {
    SHOW_SALE_TAG?: boolean;
    DISCOUNT_TAG_TEXT?: string;
    SHOW_SALE_BANNER?: boolean;
    SHOW_SPECIAL_OFFER_DESCRIPTION?: boolean;
  }
> = {
  3037: {
    SHOW_SALE_TAG: true,
    DISCOUNT_TAG_TEXT: 'LTT_SPECIAL_OFFER',
    SHOW_SALE_BANNER: true,
    SHOW_SPECIAL_OFFER_DESCRIPTION: true,
  },
  17343: {
    SHOW_SALE_TAG: true,
    DISCOUNT_TAG_TEXT: 'LTT_SPECIAL_OFFER',
    SHOW_SALE_BANNER: true,
    SHOW_SPECIAL_OFFER_DESCRIPTION: true,
  },
};

export const IS_LTT_SALE_PRODUCT = Object.keys(LTT_SALE_HARDCODINGS);

export const getDiscountTagText = ({
  tgid,
  calculatedDiscount,
}: {
  tgid: string;
  calculatedDiscount: string | string[];
}) => {
  const hardcodedDiscountTagText =
    LTT_SALE_HARDCODINGS[tgid as string]?.DISCOUNT_TAG_TEXT;
  if (hardcodedDiscountTagText) {
    return (strings as any)[hardcodedDiscountTagText];
  }
  return calculatedDiscount;
};
