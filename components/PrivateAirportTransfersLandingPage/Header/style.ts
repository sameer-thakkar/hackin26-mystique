import { cva } from '@headout/pixie/css';
import COLORS from 'const/colors';

export const headerStyles = cva({
  base: {
    '& .image-wrap': {
      paddingRight: '0!',

      '& img': {
        paddingTop: '0!',
      },
    },

    '& canvas': {
      marginLeft: '-0.5rem',
    },
  },
  variants: {
    theme: {
      light: {
        boxShadow:
          '0px 0px 1px 0px rgba(0, 0, 0, 0.10), 0px 2px 8px 0px rgba(0, 0, 0, 0.10)',
      },
      dark: {
        background: {
          base: 'transparent',
          md: `[${COLORS.PURPS.DARK_TONE_1}]`,
        },
        '& .image-wrap img': {
          paddingTop: '0!',
          filter: 'invert(100%) hue-rotate(196deg) brightness(10)!',
        },
      },
    },
  },
});
