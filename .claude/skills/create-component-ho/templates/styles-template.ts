import { sva } from '@headout/pixie/css';

export const componentStyles = sva({
  slots: ['root', 'content', 'icon'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'radii.md',
      // NEVER use font CSS properties here - Text atom handles typography
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      _disabled: {
        opacity: 'opacity.50',
        cursor: 'not-allowed',
      },
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      gap: 'space.2', // Single token - no brackets needed
    },
  },
  variants: {
    variant: {
      primary: {
        root: {
          bg: 'colors.semantic.primary',
          color: 'colors.text.onPrimary',
          _hover: { bg: 'colors.semantic.primaryHover' },
        },
      },
      secondary: {
        root: {
          bg: 'colors.semantic.secondary',
          color: 'colors.text.onSecondary',
          _hover: { bg: 'colors.semantic.secondaryHover' },
        },
      },
    },
    size: {
      sm: { root: { px: 'spacing.3', py: 'spacing.2' } },
      md: { root: { px: 'spacing.4', py: 'spacing.3' } },
      lg: { root: { px: 'spacing.6', py: 'spacing.4' } },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// MULTIPLE TOKEN VALUES SYNTAX:
// padding: '[token(spacing.space.4) token(spacing.space.8)]' // 4px 8px
// Single tokens don't need brackets: gap: 'space.2'

// RESPONSIVE STYLES:
// _mobile -> @media(max-width: 768px)
// _desktop -> @media(min-width: 768px)
