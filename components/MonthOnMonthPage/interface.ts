import { MutableRefObject } from 'react';
import { TPrismicTrustBooster } from 'utils/prismicUtils/interface';

export type TMonthOnMonthPageProps = {
  heroProps: Record<string, any>;
  isMobile: boolean;
  breadcrumbs: Record<string, any>;
  browseByCategoriesRef: MutableRefObject<HTMLDivElement | null>;
  taggedCollection: string;
  categoryTourListData: Record<string, any>;
  categoryProps: Record<string, any>;
  allTours: Record<string, any>;
  pageTabsSlice: Record<string, any>;
  displayMonth: string;
  isEntertainmentBanner?: boolean;
  bannerTrustBoosters?: TPrismicTrustBooster[];
};
