import type {
  ContentFrameworkDocumentDataBodyCategoryCarouselSlice,
  MicrositeDocumentDataBodyTourListCategorySlice,
} from 'types.prismic';

export type TCategoryTourListParserV2 = {
  tourListCategory: MicrositeDocumentDataBodyTourListCategorySlice;
  hostname: string;
  categoryCarousel?: ContentFrameworkDocumentDataBodyCategoryCarouselSlice;
  lang: string;
  localizedStrings: any;
  cookies?: { [key: string]: string };
  MBDesign?: string;
};

export interface ISet<T> {
  add(value: T): this;
  clear(): void;
  delete(value: T): boolean;
  forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: any
  ): void;
  has(value: T): boolean;
  readonly size: number;
}

export type IShowPageData = {
  tgid: number;
  uid: string;
};

export type TImageObject = {
  url: string;
  altText: string;
  description: string;
  credit: string;
};

export type TProduct = {
  microBrandsDescriptor: string;
  descriptors: [];
  listingPrice: {
    bestDiscount: number;
    cashbackType: string;
    cashbackValue: number;
    currencyCode: string;
    finalPrice: number;
    minimumPayablePrice: number;
    originalPrice: number;
    otherPricesExist: boolean;
    tourId: number;
    type: string;
  };
  allTags: string[];
  name: string;
  imageUrl: string;
  id: number;
  averageRating: number;
  reviewCount: number;
  primaryCollection: {
    displayName: string;
    id: number;
    name: string;
  };
  primaryCategory: {
    displayName: string;
    heading: string;
    id: number;
    metaDescription: string;
    metaTitle: string;
    name: string;
    rank: number;
    urlSlugs?: IUrlSlugs;
  };
  primarySubCategory: {
    categoryId: number;
    displayName: string;
    heading: string;
    id: number;
    metaDescription: string;
    metaTitle: string;
    name: string;
    rank: number;
    urlSlugs?: IUrlSlugs;
  };
  cancellationPolicy: object;
  cancellationPolicyV2: object;
  reschedulePolicy: object;
  ticketValidity: object;
  minDuration: number;
  maxDuration: number;
  combo: boolean;
  multiVariant: boolean;
  microBrandsHighlight: any;
  currencies?: [];
  urlSlugs: IUrlSlugs;
  media: {
    productImages: Array<TImageObject>;
    safetyImages: Array<TImageObject>;
    safetyVideos: Array<TImageObject>;
  };
  flowType: 'string';
};
