import { ReactNode } from "react";
import { TCityInfo, TScorpioData, TTour } from "../interface";

export type TPopulateAirportTransferProductsProps = {
  uncategorizedTours: TTour[];
  isMobile: boolean;
  scorpioData: TScorpioData[];
  city: TCityInfo;
  sharedTransferProducts: ReactNode;
  uid: string;
  currentLanguage: string;
};
