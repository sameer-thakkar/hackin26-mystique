import { TScorpioData, TTour } from 'components/AirportTransfers/interface';
import { getCategoryMap } from 'utils/productUtils';
import { TPOIFilterType } from '../POIFilters/constant';

export interface ILastMinuteFilters {
  orderedTours: TTour[];
  setOrderedFilteredTours: Function;
  setProductsLoading: Function;
  isProductCardPhase1ExpTreatment?: boolean;
  categoryInfo?: ReturnType<typeof getCategoryMap>;
  changeTourListFilterStatus?: (state: boolean) => void;
  singlePillUI?: boolean;
  poiFilteredTours?: TTour[];
  existingFilterTypes?: Set<TPOIFilterType>;
  scorpioData?: Record<string, TScorpioData>;
  inventoryFilteredTours?: TTour[];
  isTourListFiltered?: boolean;
}

export type TOnFilterChangeParams = {
  dateTimeFilter?: {
    clickedIndex: number;
    isUserAction: boolean;
    deSelect?: boolean;
  };
};
