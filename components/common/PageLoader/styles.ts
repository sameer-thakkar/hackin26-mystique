import { css, sva } from '@headout/pixie/css';

export const pageLoader = sva({
  slots: ['container', 'wrapper', 'inlineLoader', 'loadingText'],
  base: {
    container: {
      width: '[100vw]',
      height: '[100vh]',
      textAlign: 'center',
      position: 'fixed',
      zIndex: 101, // Header is 100
      top: 0,
      left: 0,
      backgroundColor: 'core.primary.white',

      '@media (max-width: 768px)': {
        height: '[100%]',
        // TODO: where is this being used?
        '&.more-date-loader': {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        },
      },
    },
    wrapper: {
      height: '[100%]',
      width: '[100%]',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inlineLoader: {
      position: 'relative',
      width: '[2.25rem]',
      height: '[2.25rem]',
      display: 'flex',
      opacity: 'opacity.100',
      visibility: 'visible',
      transition: 'opacity 0.15s',

      '&:after, &:before': {
        content: '""',
        position: 'absolute',
        borderRadius: '100%',
        border: '0.25rem solid token(colors.core.grey.300)',
        width: '[100%]',
        height: '[100%]',
      },

      '&:before': {
        borderTopColor: 'core.primary.purps',
        zIndex: 1,
        animation: 'rotateSvgPageLoaderGroup 1s infinite',
      },
    },
  },
});

export const gifContainer = css({
  position: 'relative',
  height: '[5.5rem]',
  width: '[5.5rem]',
  transition: 'opacity 0.3s linear',
  opacity: 'opacity.0', // Default state is not loaded

  '& img': {
    height: '[5.5rem]',
    width: '[5.5rem]',
  },

  '&[data-is-loaded="true"]': {
    opacity: 'opacity.100',
  },

  '@media only screen and (min-width: 768px)': {
    height: '[8rem]',
    width: '[8rem]',

    '& img': {
      height: '[8rem]',
      width: '[8rem]',
    },
  },
});
