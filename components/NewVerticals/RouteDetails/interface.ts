import { Dispatch, SetStateAction } from 'react';
import { Itinerary } from 'types/itinerary.type';

export type TRouteDetails = {
  closePopup: () => void;
  isMobile: boolean;
  tourGroupName: string;
  tgid: number;
  rank: number;
  listingPrice: Record<string, any>;
  bookingUrl: string;
  setIsSideDrawerOpen: Dispatch<SetStateAction<boolean>>;
  isCruise?: boolean;
  itineraryData?: Itinerary[];
  isDescriptorClick?: boolean;
  isSightsCoveredLayout?: boolean;
};

export type TItineraryLocationPoint = {
  latitude: number;
  longitude: number;
  placeId?: string;
};

export type TItineraryMap = {
  active: boolean;
  itineraryRoute?: {
    active: boolean;
    polyline?: string;
    polylineColor?: string;
  };
};
