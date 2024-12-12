export type TShowPagePricingSectionProps = {
  tourGroupData: Record<string, any>;
  flowType: string;
  onClose?: () => void;
  showCustomBookButtonText?: boolean;
  shouldRunCustomCTAExperiment?: boolean;
  moreShows?: any;
  moreShowsCategoryUrl?: string;
};

export type TRiveCTAProps = {
  onClick: () => void;
  primaryText: string;
};
