import { sva } from '@headout/pixie/css';

export const descriptorListStylesRecipe = sva({
  slots: ['root', 'spacer'],
  base: {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    spacer: {
      marginTop: 'space.2',
      width: '4px',
      height: '4px',
      backgroundColor: 'semantic.dividers.dark',
      rounded: 'radius.50p',
    },
  },
  variants: {
    layout: { row: {}, column: {} },
    variant: { long: {}, short: {} },
    isMobile: { true: {}, false: {} },
  },
  compoundVariants: [
    {
      variant: 'short',
      layout: 'row',
      css: {
        root: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: 'space.6',
        },
      },
    },
    {
      variant: 'long',
      layout: 'row',
      css: {
        root: {
          alignItems: 'center',
          flexDirection: 'row',
          columnGap: 'space.12',
          rowGap: 'space.8',
        },
      },
    },
    {
      variant: 'long',
      layout: 'column',
      css: {
        root: {
          flexDirection: 'column',
          rowGap: 'space.8',
        },
      },
    },
  ],
});
