import { Dispatch, SetStateAction } from 'react';

export type TSortSelectorProps = {
  isMobile: boolean;
};

export type TDrawerPopupProps = {
  handleOptionClick: () => void;
  selectedOption: Dispatch<SetStateAction<null>>;
};
