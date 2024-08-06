import { MutableRefObject } from 'react';

export type TLandingPageV2Props = {
  isMobile: boolean;
  categoryProps: any;
  allTours: Record<number, any>;
  collectionId: number;
  directTgid?: number;
  browseByCategoriesRef?: MutableRefObject<HTMLDivElement | null>;
  showHigherQualityImage?: boolean;
};
