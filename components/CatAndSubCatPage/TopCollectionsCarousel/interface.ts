import { TTopCollectionsCarousel } from 'components/CatAndSubCatPage/interface';

export type TopCollectionsCarouselProps = {
  topCollectionsCarousel: TTopCollectionsCarousel;
  taggedCity: string;
  categoryData: Record<string, any>;
  subCategoryData: Record<string, any>;
  isMobile: boolean;
};
