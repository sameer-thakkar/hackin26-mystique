import { Dispatch, SetStateAction } from 'react';
import { Itinerary } from 'types/itinerary.type';

export type TRouteInfo = {
  tgid: number | string;
  rank: number;
  openRoutesTimeline: () => void;
  isMobile: boolean;
  routeData: Itinerary;
  isCruise: boolean;
  showRoutesTimeline?: boolean;
  isSideModalOpen?: boolean;
  setIsHeaderSticky?: Dispatch<SetStateAction<boolean>>;
  isDescriptorClick?: boolean;
};

export type TScrollState = {
  triggered: Record<number, boolean>;
};
