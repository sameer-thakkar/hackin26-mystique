import { Itinerary } from 'types/itinerary.type';
import { TItineraryMap } from '../interface';

export type TNumberedMarkerIcon = {
  title: string;
  stopNumber: number | string;
};

export type TRouteMap = {
  routeMapData: TItineraryMap;
  routeName: string;
  itinerary: Itinerary;
  showRoutesTimeline?: boolean;
  isSideModalOpen?: boolean;
};
