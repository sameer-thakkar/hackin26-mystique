import { TItineraryMap } from '../interface';

export type TNumberedMarkerIcon = {
  title: string;
  stopNumber: number | string;
};

export type TRouteMap = {
  routeSectionsData: Record<string, any>[];
  routeMapData: TItineraryMap;
  isMobile: boolean;
  routeName: string;
  showRoutesTimeline?: boolean;
  isSideModalOpen?: boolean;
};
