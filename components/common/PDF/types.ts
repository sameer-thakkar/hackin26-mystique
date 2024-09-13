import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { TController } from 'components/Product/components/Popup/interface';

export type TPdfPopup = {
  onHide?: () => void;
  controller?: MutableRefObject<TController | undefined>;
  pdfData?: Record<string, any>[];
  isCTA?: boolean;
  tgid: number | string;
  rank: number;
  isMobile: boolean;
};

export type TPdfViewer = {
  documentSrc: string;
};

export type TFilterPills = {
  pdfData?: Record<string, any>[];
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
};
