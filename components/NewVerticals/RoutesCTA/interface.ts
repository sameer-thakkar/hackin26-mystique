import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { IItinerary } from '@headout/espeon/components/ItineraryV2';
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
  isDescriptorClick?: boolean;
  setIsDescriptorClick?: Dispatch<SetStateAction<boolean>>;
  itineraryInfo?: TItineraryInfo;
};

export type TItineraryInfo = {
  isCruise?: boolean;
  isMealCruise?: boolean;
  isSightsCoveredLayout?: boolean;
  itineraryData?: IItinerary[];
};
