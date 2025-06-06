import { strings } from 'const/strings';

export const LTT_SALE_HARDCODINGS: Record<
  string,
  {
    SHOW_SALE_TAG?: boolean;
    DISCOUNT_TAG_TEXT?: string;
  }
> = {
  3037: {
    SHOW_SALE_TAG: true,
    DISCOUNT_TAG_TEXT: 'LTT_SPECIAL_OFFER',
  },
};

export const IS_WICKED_SALE_PRODUCT = [3037];

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
