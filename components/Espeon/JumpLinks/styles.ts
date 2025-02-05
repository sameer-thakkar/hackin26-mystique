import { sva } from '@headout/pixie/css';

export const jumpLinksRecipe = sva({
  slots: ['root'],
  base: {
    root: {
      display: 'flex',
      gap: 'space.16',
      flexDirection: 'row',
    },
  },
  variants: {
    isDesktop: {
      true: {
        root: {
          flexDirection: 'row',
          alignItems: 'center',
        },
      },
      false: {
        root: {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      },
    },
  },
  defaultVariants: {
    isDesktop: true,
  },
});
