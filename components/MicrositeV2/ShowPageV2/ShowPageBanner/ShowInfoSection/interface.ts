import type { TBreadcrumbs } from 'types/breadcrumbs';

export type TShowInfoSectionProps = {
  tourGroupData: Record<string, any>;
  isMobile: boolean;
  isDev: boolean;
  breadcrumbs: TBreadcrumbs;
  taggedCity: string;
};
