import type { TClassName, TTourgroupItem } from 'components/Espeon/types';

export type TMetaLabel = TClassName & {
  primaryCategory?: any;
  primarySubCategory?: any;
  metaLabel?: string;
};

export type TGetCategoryColor = {
  categoryId?: NonNullable<TTourgroupItem['primaryCategory']>['id'];
  subCategoryId?: NonNullable<any['primarySubCategory']>['id'];
};

export type TGetIsCategory = Omit<TMetaLabel, 'className'>;
