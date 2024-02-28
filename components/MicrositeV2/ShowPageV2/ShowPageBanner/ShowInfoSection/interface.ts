import { TBreadcrumbs } from 'utils/breadcrumbsUtils';

export type TShowInfoSectionProps = {
  tourGroupData: Record<string, any>;
  isMobile: boolean;
  isDev: boolean;
  breadcrumbs: TBreadcrumbs;
  taggedCity: string;
};
