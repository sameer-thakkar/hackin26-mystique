import { MutableRefObject } from 'react';

export type TCategoryPageProps = {
  isMobile: boolean;
  allTours: Record<string, any>;
  heroProps: Record<string, any>;
  breadcrumbs: Record<string, any>;
  categoryProps: any;
  categoryTourListData: Record<string, any>;
  primarySubCategoryId: number | undefined;
  browseByCategoriesRef: MutableRefObject<HTMLDivElement | null>;
};
