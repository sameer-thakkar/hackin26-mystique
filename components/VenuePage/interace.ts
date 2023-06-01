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
};
