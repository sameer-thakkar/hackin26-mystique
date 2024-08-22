import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Itinerary } from 'types/itinerary.type';
import { TController } from '../RouteDetails/Popup/interface';

export type TRoutesCTA = {
  tourGroupName: string;
  tgid: number;
  listingPrice: Record<string, any>;
  bookingUrl: string;
  isMobile: boolean;
  ranking: number;
  popupController: MutableRefObject<TController | undefined>;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  isDescriptorClick: boolean;
  setIsDescriptorClick: Dispatch<SetStateAction<boolean>>;
  cruiseData?: TCruiseData;
};

export type TCruiseData = {
  isCruise?: boolean;
  isMealCruise?: boolean;
  cruisesItineraryData?: Itinerary[];
};
