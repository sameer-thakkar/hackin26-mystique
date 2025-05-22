export type TShowPagePricingSectionProps = {
  tourGroupData: Record<string, any>;
  flowType: string;
  onClose?: () => void;
  moreShows?: any;
  primarySubCategory?: Record<string, any>;
  fromDate?: string;
  toDate?: string;
  variantId?: string;
};

export type TRiveCTAProps = {
  onClick: () => void;
  onRiveVisible: (status: boolean) => void;
  primaryText: string;
  tgid: string;
  primarySubCatId: string;
};
