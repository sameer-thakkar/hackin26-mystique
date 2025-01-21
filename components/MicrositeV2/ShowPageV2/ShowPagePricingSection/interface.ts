export type TShowPagePricingSectionProps = {
  tourGroupData: Record<string, any>;
  flowType: string;
  onClose?: () => void;
  moreShows?: any;
  moreShowsCategoryUrl?: string;
};

export type TRiveCTAProps = {
  onClick: () => void;
  primaryText: string;
};
