import { Dispatch, SetStateAction } from 'react';

export type TSimilarShowsProps = {
  tgid: number | string;
  primarySubCategoryID: number;
  cityCode: string;
  isMobile: boolean;
  allShowPagesDocuments: Record<string, any>[];
  setMoreShows: Dispatch<SetStateAction<Record<string, any>[]>>;
};
