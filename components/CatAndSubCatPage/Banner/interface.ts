import type { TBreadcrumbs } from 'types/breadcrumbs';

export type BannerProps = {
  pageHeading: string;
  breadcrumbs: TBreadcrumbs;
  taggedCity?: string | null;
  primaryCity?: Record<string, any>;
  isMobile: boolean;
};
