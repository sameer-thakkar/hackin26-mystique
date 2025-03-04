import { RecipeVariantProps } from '@headout/pixie/types';
import { radioStyles } from './styles';

export type RadioButtonProps = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (active: boolean) => void;
  label: string;
  radioPosition?: 'front' | 'back';
  className?: string;
} & RecipeVariantProps<typeof radioStyles>;
