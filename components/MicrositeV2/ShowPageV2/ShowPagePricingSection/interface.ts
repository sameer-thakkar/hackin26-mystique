export type TShowPagePricingSectionProps = {
  tourGroupData: Record<string, any>;
  flowType: string;
  onClose?: () => void;
  showCustomBookButtonText?: boolean;
  shouldRunCustomCTAExperiment?: boolean;
};
