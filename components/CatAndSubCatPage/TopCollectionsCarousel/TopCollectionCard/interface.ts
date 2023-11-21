import { TCollection } from 'components/CatAndSubCatPage/interface';

export type TopCollectionCardProps = Omit<
  TCollection,
  'ratingsInfo' | 'subtext'
> & {
  ranking: number;
  isMobile: boolean;
};
