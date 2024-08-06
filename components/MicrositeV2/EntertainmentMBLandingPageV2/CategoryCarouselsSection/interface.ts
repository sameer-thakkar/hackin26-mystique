export type TCategoryCarouselsSection = {
  categoriesToRender: any[];
  allTours: any;
  isMobile: boolean;
  isCategoryPage?: boolean;
  showHigherQualityImage?: boolean;
};

export type TCategoryCarouselSwiperProps = {
  allTours: any;
  isMobile: boolean;
  index: number;
  category?: any;
  showHigherQualityImage?: boolean;
};
