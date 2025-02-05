import type { TGetIsCategory } from './types';

export const isValidCategoryToShowLabel = ({
  primaryCategory,
  primarySubCategory,
}: TGetIsCategory) => {
  return (
    primaryCategory &&
    (!primarySubCategory ||
      (primaryCategory.id === 1 && primarySubCategory.id !== 1008))
  );
};
