export type TAttractionsCarousel = {
  routeSectionsData: Record<string, any>;
  isMobile?: boolean;
  index: number;
};

export type TAttractionsList = {
  name: string;
  imageUrl: string;
  stopName: string;
};

export type TAttractionCard = TAttractionsList & {
  index: number;
  isMobile?: boolean;
};
