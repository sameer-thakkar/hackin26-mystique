import { TSubCategoryCards } from 'components/CatAndSubCatPage/interface';

export type SubCategoryCardsProps = {
  subCategoryCards: TSubCategoryCards;
  subCategoryCardsRanking: Array<number>;
  subCategoryData: Record<string, any>;
  isMobile: boolean;
};
