import { TBreadcrumbs } from 'utils/breadcrumbsUtils';

export type IAmenitiesProps = {
  isMobile: boolean;
  expandedLimit: number;
  amenitiesDropdown: Record<string, string>[];
};

export type IVenuePageProps = {
  data: any;
  isMobile: boolean;
  host: string;
  lang: string;
  uid: string;
  isDev: boolean;
  domainConfig: any;
  serverRequestStartTimestamp: string;
  tgidsInPage: Array<number>;
  breadcrumbs: TBreadcrumbs;
};

export type IAccordionSlice = {
  heading: string;
  content: string;
};

export type IVerticalCardsGrid = {
  nearby_theatre_name: string;
  theatre_info: string;
  redirect_url: {
    url: string;
  };
};

export type IAmenity = {
  amenities_list: string;
};
