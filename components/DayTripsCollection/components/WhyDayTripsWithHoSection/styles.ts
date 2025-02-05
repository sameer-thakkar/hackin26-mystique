import { cva } from '@headout/pixie/css';

export const itemsContainerStyles = cva({
  variants: {
    isDesktop: {
      false: {
        width: 'calc(100vw - 32px)',
      },
    },
  },
});
