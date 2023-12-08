import { MutableRefObject } from 'react';

export type TLandingPageV2Props = {
  isMobile: boolean;
  categoryProps: any;
  allTours: Record<number, any>[];
  directTgid?: number;
  browseByCategoriesRef?: MutableRefObject<HTMLDivElement | null>;
};
