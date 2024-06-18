import { MutableRefObject } from 'react';

export type TController = {
  open: (startingIndex?: number) => void;
  close: (isButton?: boolean) => void;
};

export type TPopupProps = {
  controller?: MutableRefObject<TController | undefined>;
  children: JSX.Element | JSX.Element[];
  tgid?: number | string;
  scrollToSection?: (index: number) => Promise<void>;
};
