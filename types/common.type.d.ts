type ListingPrice = {
  currencyCode: string;
  originalPrice: number;
  finalPrice: number;
  minimumPayablePrice: number;
  type: string;
  otherPricesExist: boolean;
  bestDiscount: number;
  cashbackValue: number;
  cashbackType: 'PERCENTAGE';
  tourId: number;
};

type Media = {
  url: string;
  altText: string;
  description: string;
  credit: string;
};
