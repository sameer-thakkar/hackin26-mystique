export type TTheatreType = {
  verticalImageUrl: string;
  redirectUrl: string;
  nearbyTheatreName: string;
  nearbyTheatreRunningShowName: string;
};

export type TVerticalCardsGridProps = {
  data: TTheatreType[];
  isMobile: boolean;
  heading: string;
};
