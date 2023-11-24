import { PrismicDocumentWithUID } from '@prismicio/types';
import { TLANGUAGELOCALE } from 'const/index';
import { TMediaData } from './ArticlePage/interface';

export type TourGroupDataType = {
  name: string;
  primarySubCategory: Record<string, any>;
  reviewCount: number;
  averageRating: number;
  microBrandsHighlight: Record<string, any>[];
  shortSummary: string;
  primaryCollection: {
    id: string;
  };
  primaryCategory: {
    id: number;
    name: string;
  };
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
  media: {
    productImages: Record<string, any>[];
  };
  id: number;
};

export type TNewsPageData = {
  tgidMappingData: any;
  allArticles: PrismicDocumentWithUID[];
  featuredArticles: PrismicDocumentWithUID[];
  articlesWithSameTgid: PrismicDocumentWithUID[];
  CFData: Record<string, any>;
  trailerSectionData: TourGroupDataType[];
  showPageDocuments: {
    results: PrismicDocumentWithUID[];
  };
  subCategoryData: any;
  videoData: Record<string, string>;
  mediaData: TMediaData[];
  collectionReviews: {
    items: Record<string, any>[];
  };
};

export type TNewsPageProps = {
  host: string;
  domainConfig: Record<string, any>;
  lang: TLANGUAGELOCALE;
  data: PrismicDocumentWithUID & TNewsPageData;
  isMobile: boolean;
  uid: string;
  isDev: boolean;
  serverRequestStartTimestamp: string;
};
