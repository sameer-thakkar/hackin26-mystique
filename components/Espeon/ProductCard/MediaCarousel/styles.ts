import { cva } from '@headout/pixie/css';

export const mediaCarouselWrapper = cva({
  base: {
    width: '100%',
    height: 'max-content',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'grab',
    rounded: 'radius.8',
    '& .custom-swiper-slides-wrapper': {
      overflowY: 'hidden',
    },
  },
  variants: {
    consumer: {
      horizontalProductCard: {
        '& img': {
          width: '36.2rem',
          height: '22.625rem',

          '@media only screen and (max-width: 768px)': {
            aspectRatio: 1.6,
            width: '100%',
            height: '100%',
          },
        },
      },

      verticalProductCardDweb: {
        '& img': {
          aspectRatio: 1.6,
        },
      },
    },
  },
});

export const controlButtonStyles = cva({
  base: {
    position: 'absolute',
    width: '10%',
    height: '100%',
    top: '0',
    zIndex: 1,
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    padding: 0,
    _groupHover: { display: 'flex' },
  },
  variants: {
    position: {
      right: {
        right: 4,
        transform: 'rotate(180deg)',
      },
      left: {
        left: 4,
      },
    },
  },
});
