import { PrismicDocumentWithUID } from '@prismicio/types';
import type { TBreadcrumbs } from 'types/breadcrumbs';

export type TShowPageV2Props = {
  CMSContent: any;
  tourGroupData: any;
  inventorySlotData: any;
  isDev: boolean;
  newsArticlesWithSameTgid: PrismicDocumentWithUID[];
  featuredNewsArticles: PrismicDocumentWithUID[];
  newsLandingPageUrl: string;
  isMobile: boolean;
  host: string;
  serverRequestStartTimestamp: string;
  domainConfig: any;
  primaryCity: any;
  categoryHeaderMenu: any;
  breadcrumbs: TBreadcrumbs;
  reviewPageUrl?: string;
};

export type ListingPrice = {
  bestDiscount: number;
  cashbackType: string;
  cashbackValue: number;
  currencyCode: string;
  extraCharges: number;
  finalPrice: number;
  groupSize: number | null;
  isPricingInclusiveOfExtraCharges: boolean;
  minimumPayablePrice: number;
  originalPrice: number;
  otherPricesExist: boolean;
  type: string;
};
