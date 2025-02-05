import { sva } from '@headout/pixie/css';

export const discountSliverStyleRecipe = sva({
  slots: ['container', 'emoji'],
  base: {
    container: {
      textStyle: 'Semantics/UI Label/Regular (Heavy)',
      background: 'semantic.surface.light.success.1',
      color: 'semantic.surface.dark.success.1',
      display: 'flex',
      alignItems: 'center',
      columnGap: 'space.8',
      boxShadow: '[0 -2px 12px rgba(84, 84, 84, 0.1)]',
      position: 'relative',
      padding: '[token(spacing.space.6) token(spacing.space.16)]',
    },
    emoji: {
      marginTop: 'space.4',
    },
  },
});
