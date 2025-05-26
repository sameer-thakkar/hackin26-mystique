import { sva } from '@headout/pixie/css';

export const swipesheetRecipe = sva({
  slots: ['root', 'container', 'heading', 'back', 'contentWrapper'],
  base: {
    root: { position: 'relative' },
    container: {
      position: 'fixed',
      top: '0px',
      left: '0px',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    heading: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      padding:
        '[token(spacing.space.32) token(spacing.space.16) token(spacing.space.16)]',
      borderBottom: '[1px solid token(colors.core.grey.300)]',
    },
    back: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      position: 'absolute',
      top: 'space.16',
      left: 0,
      padding: 0,

      _hover: {
        background: 'transparent',
      },

      _active: {
        background: 'transparent',
      },
    },
    contentWrapper: {
      padding: 'space.16',
      overflowY: 'auto',
      maxWidth: '[100vw]',
      overflowX: 'hidden',
    },
  },
});
