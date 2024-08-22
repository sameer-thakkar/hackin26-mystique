export type TAttractionsCarousel = {
  routeSectionsData: Record<string, any>;
  isMobile?: boolean;
  index: number | string;
  hideStopName?: boolean;
  isSightsCovered?: boolean;
  excludeStopAsAttraction?: boolean;
};

export type TAttractionsList = {
  name: string;
  imageUrl: string;
  stopName: string;
};

export type TAttractionCard = TAttractionsList & {
  index: number;
  isMobile?: boolean;
  hideStopName?: boolean;
};
