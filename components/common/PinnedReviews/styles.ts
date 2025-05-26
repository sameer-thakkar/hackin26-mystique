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
      '@media (max-width: 768px)': {
        padding: 'space.16',
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
      width: '[102vw]',
    },
  },
});
