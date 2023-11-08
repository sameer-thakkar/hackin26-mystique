import {
  TScorpioData,
  TTour,
} from 'components/AirportTransfers/PopulateAirportTransferProducts/interfaces';

export type TPrivateAirportTransferProductCardProps = {
  isMobile: boolean;
  scorpioData: TScorpioData;
  airportName: string;
  tour: TTour;
  uid: string;
  currentLanguage: string;
};
