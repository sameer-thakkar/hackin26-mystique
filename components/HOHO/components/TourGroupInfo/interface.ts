export type TourGroupInfoProps = {
  tourGroupImage: Record<string, any>;
  tourGroupName: string;
  tourGroupId: string | number;
  tourGroupHighlights: Array<Record<string, any>>;
  images: Array<{ url: string; altText: string }>;
  isMobile: boolean;
  swipeNext: () => void;
  swipePrev: () => void;
  activeIndex: number;
  totalCards: number;
  index: number;
  tgidRouteData: Record<string, any>;
  timings?: string;
  frequency?: string;
};
