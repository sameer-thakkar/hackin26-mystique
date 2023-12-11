import { getCategoryMap } from 'utils/productUtils';

export type TCategoryFilterDrawerProps = {
  categoriesAndSubCategories: ReturnType<
    typeof getCategoryMap
  >['categoriesAndSubCategories'];
  categoryStates: Record<number, boolean>;
  onClose: () => void;
  onApply: (state: Record<number, boolean>) => void;
  onClear: () => void;
};
