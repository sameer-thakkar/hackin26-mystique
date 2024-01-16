import { TCategoryContainerProps } from 'components/Product/interface';
import {
  CategoryIcon,
  StyledCategoryContainer,
} from 'components/Product/styles';
import { getCategoryIconUrl } from 'utils/image';
import COLORS from 'const/colors';

const getCategoryIconColor = (categoryId?: number, subCategoryId?: number) => {
  switch (true) {
    case categoryId === 1:
      return '#9E6A00';
    case categoryId === 2:
      return COLORS.HOLA_YELLOW[3];
    case categoryId === 3:
      return COLORS.OKAY_GREEN[3];
    case categoryId === 18:
      return '#03748C';
    case subCategoryId === 1080:
      return 'linear-gradient(90deg, #4A00E0 0%, #8E2DE2 100%)';
    default:
      return '#0F43BD';
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

  const { displayName, id } = isCategory ? primaryCategory : primarySubCategory;

  const iconURL = getCategoryIconUrl({ isCategory, entityId: id });

  return (
    <StyledCategoryContainer
      $background={getCategoryIconColor(
        primaryCategory?.id,
        primarySubCategory?.id
      )}
    >
      <CategoryIcon $svgUrl={iconURL} />
      <span>{displayName}</span>
    </StyledCategoryContainer>
  );
};

export default Category;
