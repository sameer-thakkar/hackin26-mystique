type TFilterItem = {
  label: string;
  value: 'popularity' | 'ascending' | 'descending';
};

export type SortFiltersProps = {
  filters: Array<TFilterItem>;
  onChange: (item: TFilterItem) => void;
  currentValue: TFilterItem['value'];
};
