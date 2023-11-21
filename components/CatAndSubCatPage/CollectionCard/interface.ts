import { TCollection } from 'components/CatAndSubCatPage/interface';

export type CollectionCardProps = TCollection & {
  ratingsInfo: Record<string, any>;
  subtext: string;
  ranking: number;
  isSubCategoryPage: boolean;
  sectionName?: string;
  isMobile: boolean;
};
