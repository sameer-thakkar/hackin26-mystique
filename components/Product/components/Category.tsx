import type { TCategoryContainerProps } from 'components/Product/interface';
import { StyledCategoryContainer } from 'components/Product/styles';

const getCategoryIconColor = (categoryId?: number, subCategoryId?: number) => {
  switch (true) {
    case categoryId === 1:
      return '#906100';
    case categoryId === 2:
      return '#8d2b79';
    case categoryId === 3:
      return '#4545c2';
    case categoryId === 18:
      return '#0b5f6a';
    case subCategoryId === 1080:
      return 'linear-gradient(90deg, #4A00E0 0%, #8E2DE2 100%)';
    default:
      return '#a4563b';
  }
};

const Category = ({
  primaryCategory,
  primarySubCategory,
}: TCategoryContainerProps) => {
  if (!primaryCategory?.id && !primarySubCategory?.id) return null;

  const isCategory =
    primaryCategory &&
    (!primarySubCategory ||
      (primaryCategory.id === 1 && primarySubCategory.id !== 1008));

  const { displayName } = isCategory ? primaryCategory : primarySubCategory;

  return (
    <StyledCategoryContainer
      $background={getCategoryIconColor(
        primaryCategory?.id,
        primarySubCategory?.id
      )}
    >
      <span>{displayName}</span>
    </StyledCategoryContainer>
  );
};

export default Category;
