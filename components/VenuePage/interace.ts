import { MutableRefObject } from 'react';
import { TScorpioData, TTour } from 'components/AirportTransfers/interface';
import { TMoreDetailsPopupContentProps } from 'components/AirportTransfers/ProductCard/interface';
import { TController } from 'components/Product/components/Popup/interface';
import { TBreadcrumbs } from 'utils/breadcrumbsUtils';

export type IAmenitiesProps = {
  isMobile: boolean;
  expandedLimit: number;
  amenitiesDropdown: Record<string, string>[];
};

export type IVenuePageProps = {
  data: any;
  isMobile: boolean;
  host: string;
  lang: string;
  uid: string;
  isDev: boolean;
  domainConfig: any;
  serverRequestStartTimestamp: string;
  tgidsInPage: Array<number>;
  breadcrumbs: TBreadcrumbs;
};

export type IAccordionSlice = {
  heading: string;
  content: RichTextField;
};

export type IVerticalCardsGrid = {
  nearby_theatre_name: string;
  theatre_info: string;
  redirect_url: {
    url: string;
  };
};

export type IAmenity = {
  amenities_list: string;
};
export type TMoreDetailsPopupDesktopProps = {
  scorpioData: TScorpioData;
  mbTheme: string;
  popupController: MutableRefObject<TController | undefined>;
  tour: TTour;
  currentLanguage: string;
  isMobile: boolean;
  productBookingUrl: string;
  showComboVariant: boolean;
  onShowComboPopup: (placement: string) => void;
  onCloseComboPopup: () => void;
  PopupContent: (props: TMoreDetailsPopupContentProps) => JSX.Element;
  sendBookNowEvent: (placement: string) => void;
};
