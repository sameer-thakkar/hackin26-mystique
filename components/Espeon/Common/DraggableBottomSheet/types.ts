import type { ReactNode } from 'react';

export type TBottomSheetProps = {
  children: ReactNode;
  sheetHeight?: string;
  dragLimit?: number;
  onCloseInit?: () => void;
  onCloseCompletion?: () => void;
  enableDrag?: boolean;
  header?: ReactNode;
  transparentGrabBar?: boolean;
  hasRoundedCorners?: boolean;
  isOverHeader?: boolean;
};

export type TBottomSheetHandle = {
  closeSheet: () => void;
};
