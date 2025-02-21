import { Dispatch, SetStateAction } from 'react';
import { TScorpioData, TTour } from 'components/AirportTransfers/interface';
import { TPOIFilterType } from './constant';

export type TPOIFilterProps = {
  isMobile: boolean;
  existingFilterTypes: Set<TPOIFilterType>;
  activeFilter: TPOIFilterType | null;
  setActiveFilter: Dispatch<SetStateAction<TPOIFilterType | null>>;
  inventoryFilteredTours: TTour[];
  scorpioData: Record<string, TScorpioData>;
  setProductsLoading: (loading: boolean) => void;
  allTours: TTour[];
  isTourListFiltered: boolean;
};
