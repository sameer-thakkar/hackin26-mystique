import { sva } from '@headout/pixie/css';

export const cardGridStylesRecipe = sva({
  slots: ['root', 'rowWrapper', 'cardWrapper'],
  base: {
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',

      gap: 'var(--row-gap)',
    },
    rowWrapper: {
      display: 'flex',
      flexDirection: 'row',
      gap: 'var(--column-gap)',
      justifyContent: 'flex-start',
    },
    cardWrapper: {
      maxWidth: '100%',
    },
  },
});
