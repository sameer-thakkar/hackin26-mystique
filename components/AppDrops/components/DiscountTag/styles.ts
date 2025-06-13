import { css, sva } from '@headout/pixie/css';

export const discountTagRecipe = sva({
  slots: ['wrapper', 'tag', 'logo', 'text'],
  base: {
    wrapper: {
      position: 'absolute',
      top: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '2',
      '@media (min-width: 768px)': {
        position: 'static',
        transform: 'none',

        '&::before': {
          borderRight: 'transparent',
        },

        '&::after': {
          borderLeft: 'transparent',
        },
      },

      '@media (max-width: 768px)': {
        border: '1px solid rgba(107, 1, 52, 0.11)',
        boxShadow: '0px 6px 16px 5px rgba(131, 1, 63, 0.08)',
        borderRadius: '16px',
      },

      '&::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '-10px',
        width: '0',
        height: '0',
        borderTop: '10px solid transparent',
        borderRight: '10px solid rgba(142, 100, 120, 1)',
        borderBottom: '0',
        borderLeft: '0',
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        right: '-10px',
        width: '0',
        height: '0',
        borderTop: '10px solid transparent',
        borderRight: '0',
        borderBottom: '0',
        borderLeft: '10px solid rgba(142, 100, 120, 1)',
      },
    },
    tag: {
      position: 'relative',
      zIndex: '1',
      display: 'flex',
      height: '1.8rem',
      gap: '8px',
      maxWidth: 'fit-content',
      minWidth: '12.875rem',
      alignItems: 'center',
      padding: '8px 16px',
      borderRadius: '0 0 16px 16px',
      background:
        'radial-gradient(131.5% 140.11% at 49.79% 0.71%, #FFE5E5 0%, #FFFFFF 100%)',
      color: 'core.primary.white',

      '@media (min-width: 768px)': {
        background: 'transparent',
        height: '1.875rem',
        padding: '0',
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

export const onText = css({
  textAlign: 'center',
  fontSize: '19px',
  fontWeight: 'font.weight.500',
  lineHeight: '24px',
  letterSpacing: '0px',
  marginBottom: '8px',
});

export const headerLogoContainer = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  height: '20px',
});
