import { Dispatch, SetStateAction } from 'react';

export type TRouteDetails = {
  closePopup: () => void;
  isMobile: boolean;
  tourGroupName: string;
  tgid: number;
  listingPrice: Record<string, any>;
  bookingUrl: string;
  setIsSideDrawerOpen: Dispatch<SetStateAction<boolean>>;
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
