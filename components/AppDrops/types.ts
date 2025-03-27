import { RecipeVariantProps } from '@headout/pixie/types';
import { discountTagRecipe } from './components/DiscountTag/styles';
import { stepsRecipe } from './components/Steps/styles';

export type TDiscountTagProps = {
  isMobile?: boolean;
  variant?: RecipeVariantProps<typeof discountTagRecipe>;
};

export type TStepsProps = {
  variant?: RecipeVariantProps<typeof stepsRecipe>;
  showHighlightedTextLine?: boolean;
};

export type TExitIntentBottomSheetContentProps = {
  onClose?: () => void;
};

export type TExitIntentDialogContentProps = {
  onClose?: () => void;
  isVisible?: boolean;
};
