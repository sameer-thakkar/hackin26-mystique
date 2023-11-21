export type TSortingOrders = 'popularity' | 'ascending' | 'descending';

export type SortSelectorProps = {
  sortingOrder: TSortingOrders;
  setSortingOrder: (sortingOrder: TSortingOrders) => void;
  isMobile: boolean;
};
