import { getCategoryMap } from 'utils/productUtils';

export interface ILastMinuteFilters {
  orderedTours: Record<string, any>[];
  setOrderedFilteredTours: Function;
  setProductsLoading: Function;
  isProductCardPhase1ExpTreatment?: boolean;
  categoryInfo?: ReturnType<typeof getCategoryMap>;
  changeTourListFilterStatus?: (state: boolean) => void;
}

export type TOnFilterChangeParams = {
  dateTimeFilter?: {
    clickedIndex: number;
    isUserAction: boolean;
    deSelect?: boolean;
  };
};
