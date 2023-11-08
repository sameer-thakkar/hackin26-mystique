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
  localSymbol: string;
};

type Media = {
  url: string;
  altText: string;
  description: string;
  credit: string;
};

type TRichTextArray = {
  spans: Array<Object>;
  type: string;
  text: string;
};

type TCategorisationMetadata = {
  tagged_city: string | null;
  tagged_country: string | null;
  tagged_collection: string | null;
  tagged_category: string | null;
  tagged_sub_category: string | null;
  tagged_mb_type: string | null;
  tagged_page_type: string | null;
  primary_tag: string | null;
  shoulder_page_type: string | null;
  shoulder_page_custom_label: string | null;
  tagged_content_type: Object[] | [];
};
