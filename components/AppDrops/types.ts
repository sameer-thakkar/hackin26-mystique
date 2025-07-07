import { RecipeVariantProps } from '@headout/pixie/types';
import { discountTagRecipe } from './components/DiscountTag/styles';

export type TDiscountTagProps = {
  variant?: RecipeVariantProps<typeof discountTagRecipe>;
};

export type TExitIntentBottomSheetContentProps = {
  onClose?: () => void;
  cityCode: string | null;
};

export type TExitIntentDialogContentProps = {
  onClose?: () => void;
  isVisible?: boolean;
  cityCode: string | null;
};

export type TDropsComponentProps = {
  cityCode: string | null;
  isMarginNotRequired?: boolean;
};

export type TDownloadAppNudgeProps = {
  isExitIntent?: boolean;
  cityCode: string | null;
};
