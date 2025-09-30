import { Dispatch, SetStateAction } from 'react';
import { IItinerary } from '@headout/espeon/components/ItineraryV2';

export type TRouteInfo = {
  tgid: number | string;
  rank: number;
  openRoutesTimeline: () => void;
  isMobile: boolean;
  routeData: IItinerary;
  isCruise: boolean;
  showRoutesTimeline?: boolean;
  isSideModalOpen?: boolean;
  setIsHeaderSticky?: Dispatch<SetStateAction<boolean>>;
  isDescriptorClick?: boolean;
  isSightsCoveredLayout?: boolean;
};

export type TScrollState = {
  triggered: Record<number, boolean>;
};
