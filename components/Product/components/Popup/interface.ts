import { CSSProperties, MutableRefObject } from 'react';

export type TController = {
  open: (startingIndex?: number) => void;
  close: (isButton?: boolean) => void;
};

export type TPopupProps = {
  controller?: MutableRefObject<TController | undefined>;
  children: JSX.Element | JSX.Element[];
  tgid?: number | string;
  scrollToSection?: (index: number) => Promise<void>;
  slideUp?: boolean;
  onStateChange?: (isOpen: boolean) => void;
  styles?: {
    content?: CSSProperties;
    overlay?: CSSProperties;
  };
  defaultOpen?: boolean;
  scrollToIndex?: number;
};
