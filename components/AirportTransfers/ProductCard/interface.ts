import { MutableRefObject } from 'react';
import { TController } from 'components/Product/components/Popup/interface';
import { TScorpioData, TTour } from '../interface';

export type TMoreDetailsPopupContentProps = {
  scorpioData: TScorpioData;
  tour: TTour;
  currentLanguage: string;
  isMobile: boolean;
  mbTheme: string;
  showComboVariant: boolean;
  expandContent: boolean;
  isInPopup: boolean;
  handleShowComboPopup: (placement: string) => void;
  handleCloseComboPopup: () => void;
  productBookingURL: string;
  desktopPopupController?: MutableRefObject<TController | undefined>;
  desktopPopupScrollHandler?: (
    scrollTop?: number,
    startWithReviews?: boolean
  ) => void;
  sendBookNowEvent: (placement: string) => void;
};
export type TProductCardProps = {
  scorpioData: TScorpioData;
  tour: TTour;
  isMobile: boolean;
  extraQueryParamsForBookingURL?: string;
  position?: number;
};
