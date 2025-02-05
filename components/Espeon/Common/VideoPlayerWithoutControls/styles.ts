import { sva } from '@headout/pixie/css';

const fadeOutAnimation = {
  '0%': {
    opacity: 'initial',
  },
  '100%': {
    opacity: '0',
  },
};

export const videoPlayerWithoutControlsStyles = sva({
  className: 'video-container',
  slots: ['container', 'video'],
  base: {
    container: {
      position: 'relative',
      display: 'grid',
      justifyItems: 'end',
      // width: '100%',

      '& img': {
        zIndex: 1,
        objectFit: 'cover',
        width: '100%',
        height: '100% !important',
      },

      '& img, & video': {
        // gridRow: '1 / 2',
        // gridColumn: '1 / 2',
        gridArea: '1 / 1 / 2 / 2',
      },

      // '@media (min-width: 768px)': {
      width: 'var(--width)',
      height: 'var(--height)',
      // },
    },
    video: {
      // width: '100%',
      // height: '100%',
      objectFit: 'cover',
      // '@media (min-width: 768px)': {
      width: 'var(--width)',
      height: 'var(--height)',
      // },
    },
  },
  variants: {
    fadeInVideo: {
      true: {
        container: {
          '& img': {
            animation: `${fadeOutAnimation} 1.6s ease-in-out forwards`,
          },
        },
      },
    },
  },
});
