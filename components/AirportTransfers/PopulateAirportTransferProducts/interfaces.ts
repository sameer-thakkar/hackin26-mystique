import { ReactNode } from 'react';

export type TCityInfo = {
  cityCode: string;
  city: string;
  countryCode: string;
  country: string;
  currency: Currency;
};

type Currency = {
  code: string;
  currencyName: string;
  symbol: string;
  localSymbol: string;
  precision: number;
  currency: string;
};

export type TTour = {
  tgid: number;
  cta_url_suffix: string | null;
  marketing_highlights_override: string | null;
  offer__free_tour: {
    link_type: string;
  };
  product_booster: any[];
  short_summary: any[];
  show_scratch_price: string;
  tag_booster: string | null;
  tid: number | null;
  tour_description_override: any[];
  tour_title_override: string | null;
  flowType: string;
  earliestAvailability: {
    startDate: string;
  };
};

export type TScorpioData = {
  allTags: string[];
  available: boolean;
  averageRating: number;
  ctaBooster: string;
  descriptors: string[];
  highlights: TScorpioDataHighlight[];
  isMBHighlightsExist: boolean;
  imageUrl: string;
  images: Image[];
  listingPrice: ListingPrice;
  productHighlights: string;
  productTitle: string;
  reviewCount: number;
  safetyImages: any[];
  title: string;
  combo: boolean;
  multiVariant: boolean;
  minDuration: number;
  maxDuration: number;
  primaryCollection: null | any;
  primaryCategory: TCategory;
  primarySubCategory: TSubCategory;
  flowType: string;
  allVariantOpenDated: boolean;
};

export type TScorpioDataHighlight = {
  type: string;
  content: Content;
  text: string;
  spans: Span[];
};

type Content = {
  text: string;
  spans: Span[];
};

type Span = {
  type: string;
  start: number;
  end: number;
  data?: {
    url: string;
    preview: {
      title: string;
    };
  };
};

type Image = {
  url: string;
  altText: string;
  description: string;
  credit: string;
};

type TListingPrice = {
  currencyCode: string;
  originalPrice: number;
  finalPrice: number;
  minimumPayablePrice: number;
  type: string;
  otherPricesExist: boolean;
  bestDiscount: number;
  cashbackValue: number;
  cashbackType: string;
  tourId: number;
  code: string;
  currencyName: string;
  symbol: string;
  localSymbol: string;
  precision: number;
  currency: string;
};

type TCategory = {
  id: number;
  name: string;
  rank: number;
  displayName: string;
  heading: string;
  metaTitle: string;
  metaDescription: string;
  noIndex: boolean;
  canonicalUrl: null | string;
  medias: Media[];
  microBrandInfo: TMicroBrandInfo;
};

type TSubCategory = TCategory & {
  categoryId: number;
};
type TMedia = {
  url: string;
  type: string;
  metadata: TMetadata;
  info: TInfo;
};

type TMetadata = {
  altText: string;
  height: number;
  width: number;
  videoDuration: null | number;
  uploadDate: string;
  filename: string;
  fileSize: number;
};

type TInfo = {
  sourceType: string;
  sourceUrl: string;
  credit: string;
  filename: string;
  fileSize: number;
};

type TMicroBrandInfo = {
  descriptors: null | any;
  highlights: null | any;
  supportedLanguages: any[];
  metaTitle: null | string;
  metaDescription: null | string;
};

export type TPopulateAirportTransferProductsProps = {
  uncategorizedTours: TTour[];
  isMobile: boolean;
  scorpioData: TScorpioData[];
  city: TCityInfo;
  sharedTransferProducts: ReactNode;
  uid: string;
  currentLanguage: string;
};
