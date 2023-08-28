import { ButtonHTMLAttributes } from 'react';

export type ButtonType = {
  size: 'large' | 'medium' | 'small';
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: 'front' | 'back';
  className?: string;
  onClick?: null | Function;
  width?: string;
  height?: string;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
} & (
  | {
      variant: 'primary' | 'secondary' | 'tertiary';
      color: 'purps' | 'candy' | 'slate';
    }
  | {
      variant: 'primary' | 'secondary';
      color: 'green' | 'red' | 'white';
    }
) &
  ButtonHTMLAttributes<HTMLButtonElement>;
