import { TBreadcrumbs } from 'utils/breadcrumbsUtils';

export type BannerProps = {
  pageHeading: string;
  breadcrumbs: TBreadcrumbs;
  taggedCity?: string | null;
  primaryCity?: Record<string, any>;
  isMobile: boolean;
};
