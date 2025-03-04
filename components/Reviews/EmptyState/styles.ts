import { sva } from '@headout/pixie/css';

export const emptyStateStyles = sva({
  slots: ['container', 'illustration', 'contentContainer'],
  base: {
    container: {
      display: 'flex',
      alignItems: 'center',
      flexDir: 'column',
      padding: 'space.16',
      gap: 'space.24',
    },
    illustration: {
      height: '[200px]',
    },
    contentContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDir: 'column',
      gap: 'space.8',
      width: '[260px]',
    },
  },
});
