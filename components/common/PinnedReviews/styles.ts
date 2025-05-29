import { sva } from '@headout/pixie/css';

export const containerRecipe = sva({
  slots: [
    'root',
    'headingContainer',
    'arrowButton',
    'carouselWrapper',
    'mWebCarousel',
  ],
  base: {
    root: {
      height: '[248px]',
      width: '[744px]',

      '@media (max-width: 768px)': {
        height: '[302px]',
        width: '[calc(100vw - 32px)]',

        '&[data-is-loading="false"]': {
          padding: 'space.16',
        },
      },
    },
    headingContainer: {
      '@media (min-width: 768px)': {
        width: '[732px]',
      },
    },
    arrowButton: {
      '& > span': {
        transform: '[translateY(-2px)]',
      },
    },
    carouselWrapper: {
      width: '[752px]',
    },
    mWebCarousel: {
      width: 'calc(100% + 1rem) !important',
      marginLeft: '-space.16 !important',
      paddingRight: 'space.16',

      '& > *:first-child': {
        marginLeft: 'space.16 !important',
      },
    },
  },
});
