import { Dispatch, SetStateAction } from 'react';

export type TRouteInfo = {
  openRoutesTimeline: () => void;
  isMobile: boolean;
  routeData: Record<string, any>;
  showRoutesTimeline?: boolean;
  isSideModalOpen?: boolean;
  setIsHeaderSticky?: Dispatch<SetStateAction<boolean>>;
};
