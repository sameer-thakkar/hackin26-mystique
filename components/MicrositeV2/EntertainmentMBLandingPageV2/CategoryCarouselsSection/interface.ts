export type TCategoryCarouselsSection = {
  categoriesToRender: any[];
  allTours: any;
  isMobile: boolean;
  isCategoryPage?: boolean;
};

export type TCategoryCarouselSwiperProps = {
  allTours: any;
  isMobile: boolean;
  index: number;
  category?: any;
};
