import { css, sva } from '@headout/pixie/css';

export const discountTagRecipe = sva({
  slots: ['wrapper', 'tag', 'logo', 'text', 'dropsLogo'],
  base: {
    tag: {
      display: 'flex',
      gap: 'space.8',
      maxWidth: 'fit-content',
      alignItems: 'center',
      color: 'core.primary.white',

      '@media (min-width: 768px)': {
        minWidth: '12.875rem',
      },
    },
    logo: {
      width: '5rem',
      objectFit: 'contain',

      '@media (min-width: 768px)': {
        width: '6.25rem',
      },
    },
    dropsLogo: {
      '@media (max-width: 768px)': {
        height: '20px',
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
        tag: {
          justifyContent: 'center',
          maxWidth: '100%',
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
  fontSize: '13px',
  lineHeight: '17px',
  fontWeight: 'font.weight.500',
  letterSpacing: '0px',

  '@media (min-width: 768px)': {
    fontSize: '19px',
    lineHeight: 'space.24',
    marginBottom: 'space.8',
  },
});

export const headerLogoContainer = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 'space.8',
});
