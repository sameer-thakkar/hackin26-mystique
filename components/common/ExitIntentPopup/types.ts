export type TExitIntentContentWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  contentComponent: React.ReactNode;
  mobileComponent?: React.ReactNode;
  trackingEventName?: string;
  trackingProperties?: Record<string, any>;
  bottomSheetProps?: {
    sheetHeight?: string;
    hidePill?: boolean;
    roundedBorder?: boolean;
    [key: string]: any;
  };
};
