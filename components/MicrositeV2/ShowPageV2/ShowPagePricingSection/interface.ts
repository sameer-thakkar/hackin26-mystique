export type TShowPagePricingSectionProps = {
  tourGroupData: Record<string, any>;
  flowType: string;
  onClose?: () => void;
  moreShows?: any;
  primarySubCategory?: Record<string, any>;
};

export type TRiveCTAProps = {
  onClick: () => void;
  primaryText: string;
  tgid: string;
  primarySubCatId: string;
};
