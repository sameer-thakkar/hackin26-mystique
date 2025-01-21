import { TTour } from 'components/AirportTransfers/interface';

export type TSinglePillFiltersProps = {
  dateTimeFilters: {
    key: string;
    display_name: string;
    value: string | null;
  }[];
  selectedDateTimeFilterIndex: number;
  onFilterChange: Function;
  inventoryData: any;
  poiFilteredTours: TTour[];
};
