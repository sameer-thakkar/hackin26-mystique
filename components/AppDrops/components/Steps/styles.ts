import { sva } from '@headout/pixie/css';

export const stepsRecipe = sva({
  slots: [
    'container',
    'stepItem',
    'iconContainer',
    'highlightedText',
    'textLineImage',
  ],
  base: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      '@media (max-width: 768px)': {
        gap: '16px',
      },
    },
    stepItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    iconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '1.25rem',
      height: '1.25rem',
    },
    highlightedText: {
      fontWeight: 'bold',
      margin: '0 2px',
      position: 'relative',
    },
    textLineImage: {
      position: 'absolute',
      bottom: '-4px',
      right: '0',
    },
  },
  variants: {
    variant: {
      default: {},
      exitIntent: {
        container: {
          marginTop: '12px',
          '@media (max-width: 768px)': {
            gap: '6px',
          },
        },
      },
      dialog: {
        container: {
          marginTop: '12px',
          marginBottom: '24px',
          '@media (max-width: 768px)': {
            gap: '6px',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
