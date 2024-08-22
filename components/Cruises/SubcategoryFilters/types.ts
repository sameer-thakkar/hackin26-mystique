import { Dispatch, SetStateAction } from 'react';

export type SubCategoryFiltersProps = {
  subCategoryPills: TFilterPills[];
  isMobile: boolean;
  setActiveSubCat: Dispatch<SetStateAction<number>>;
};

export type TFilterPills = {
  id: number;
  label: string;
  iconUrl: string;
  subCatId?: number;
};
