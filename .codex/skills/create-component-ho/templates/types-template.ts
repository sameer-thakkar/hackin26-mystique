import type { RecipeVariantProps } from '@headout/pixie/css';
import type { componentStyles } from './styles';

// Derive variant props from styles
export type TComponentVariants = RecipeVariantProps<typeof componentStyles>;

// Main component props - use T prefix for types
export type TComponentProps = {
  /** Primary content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
} & TComponentVariants &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

// NAMING CONVENTIONS:
// T prefix for types (preferred): TComponentProps, TBadgeProps
// I prefix for interfaces (sparingly): IBadgeInterface
// Prefer types over interfaces for better composition with & operator
