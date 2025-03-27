import { sva } from '@headout/pixie/css';

export const discountTagRecipe = sva({
  slots: ['wrapper', 'tag', 'logo', 'text'],
  base: {
    wrapper: {
      position: 'absolute',
      top: '-6px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '1',

      '@media (min-width: 768px)': {
        left: '32px',
        transform: 'none',
      },

      '&::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '-6px',
        width: '0',
        height: '0',
        borderTop: '6px solid transparent',
        borderRight: '6px solid #6B0134',
        borderBottom: '0',
        borderLeft: '0',
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        right: '-6px',
        width: '0',
        height: '0',
        borderTop: '6px solid transparent',
        borderRight: '0',
        borderBottom: '0',
        borderLeft: '6px solid #6B0134',
      },
    },
    tag: {
      position: 'relative',
      zIndex: '1',
      display: 'flex',
      height: '1.625rem',
      gap: '8px',
      maxWidth: 'fit-content',
      minWidth: '12.875rem',
      alignItems: 'center',
      padding: '8px 16px',
      borderRadius: '0 0 16px 16px',
      background: 'linear-gradient(180deg, #CC0062 0%, #660031 100%)',
      color: 'core.primary.white',

      '@media (min-width: 768px)': {
        height: '1.875rem',
      },
    },
    logo: {
      width: '5rem',
      height: '1.375rem',
      objectFit: 'contain',

      '@media (min-width: 768px)': {
        width: '6.25rem',
        height: '1.875rem',
      },
    },
    text: {
      paddingBottom: '4px',
    },
  },
  variants: {
    variant: {
      default: {},
      exitIntent: {
        logo: {
          width: '5rem',
          height: '1.625rem',
        },
      },
      dialog: {
        wrapper: {
          position: 'static',
          left: 'auto',
          top: 'auto',
          transform: 'none',

          '&::before': {
            display: 'none',
          },

          '&::after': {
            display: 'none',
          },
        },
        tag: {
          height: '1.875rem',
          padding: '6px 8px',
          borderRadius: '8px',
          minWidth: 'auto',
        },
        logo: {
          width: '6.25rem',
          height: '1.875rem',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
