import { TBreadcrumbs } from 'utils/breadcrumbsUtils';

export type BreadcrumbsProps = {
  breadcrumbs: TBreadcrumbs;
  taggedCity?: string | null;
  primaryCity?: Record<string, any>;
  showName?: string;
  isV2MB?: boolean;
  isContentPage?: boolean;
  isShowPage?: boolean;
  isVenuePage?: boolean;
  isCatOrSubCatPage?: boolean;
  isNewsPage?: boolean;
  isMobile: boolean;
};
