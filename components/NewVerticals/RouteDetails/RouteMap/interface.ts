import { IItinerary } from '@headout/espeon/components/Itinerary';
import { TItineraryMap } from '../interface';

export type TNumberedMarkerIcon = {
  title: string;
  stopNumber: number | string;
};

export type TRouteMap = {
  routeMapData: TItineraryMap | undefined;
  routeName: string;
  itinerary: IItinerary;
  showRoutesTimeline?: boolean;
  isSideModalOpen?: boolean;
  showLegend?: boolean;
  isOnTop?: boolean;
  showOverlay?: boolean;
  sectionName: string;
  isSightsCoveredLayout?: boolean;
};
