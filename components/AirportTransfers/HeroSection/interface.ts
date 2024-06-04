import { TScorpioData, TTour } from '../interface';

export type TAirportTransferHeroSectionProps = {
  isMobile: boolean;
  cityName: string;
  tours: TTour[];
  tgidScorpioDataMap: TScorpioData;
  shouldShowSearch: boolean;
};
