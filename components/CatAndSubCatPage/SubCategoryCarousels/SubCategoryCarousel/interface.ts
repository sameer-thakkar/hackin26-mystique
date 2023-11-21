import { TCollection } from 'components/CatAndSubCatPage/interface';

export type SubCategoryCarouselProps = {
  heading: string;
  name: string;
  subCategoryPageUrl: string;
  carouselData: Array<TCollection>;
  isMobile: boolean;
};
