export type TVariantListingPrice = {
  currencyCode: string;
  originalPrice: number;
  finalPrice: number;
  minimumPayablePrice: number;
  type: string;
  otherPricesExist: boolean;
  bestDiscount: number;
  cashbackValue: number;
  cashbackType: string;
  groupSize: number | string | null;
};

export type VariantCardProps = {
  variantId: number | string;
  variantName: string;
  variantListingPrice: TVariantListingPrice;
  variantInfo: string | null;
  tgid: number | string;
  tourGroupName: string;
  isMobile: boolean;
  currency: string | null;
  maxDescriptors: number;
  isSingleVariant: boolean;
  index: number;
  tourId?: number | string;
  isBestseller?: boolean;
  showDummyScratchPrice?: boolean;
  showDummyHeading?: boolean;
};
