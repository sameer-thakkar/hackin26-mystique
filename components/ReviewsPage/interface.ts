import { TLANGUAGELOCALE } from 'const/index';

export type TReviewsPageProps = {
  host: string;
  domainConfig: Record<string, any>;
  lang: TLANGUAGELOCALE;
  data: Record<string, any>;
  isMobile: boolean;
  uid: string;
  isDev: boolean;
  serverRequestStartTimestamp: string;
};
