import { TTGIDScorpioDataMap, TTour } from '../interface';

export type TAirportTransfersProductSectionProps = {
  isMobile: boolean;
  tgidScorpioDataMap: TTGIDScorpioDataMap;
  uncategorizedTours: TTour[];
  isSubCategoryPage: boolean;
  enableEarliestAvailability: boolean;
  currency: string | null;
};
