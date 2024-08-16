import { PrismicDocumentWithUID } from '@prismicio/types';
import { TBreadcrumbs } from 'utils/breadcrumbsUtils';

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
  showCustomBookButtonCTA?: boolean;
  shouldRunCustomCTAExperiment?: boolean;
};
