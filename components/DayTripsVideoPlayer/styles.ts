import { sva } from '@headout/pixie/css';

export const videoPlayerStyles = sva({
  slots: [
    'container',
    'thumbnailWrapper',
    'videoWrapper',
    'playerContainer',
    'clickOverlay',
    'chatBubbleWrapper',
    'chatBubble',
    'chatBubbleContent',
    'playButtonWrapper',
    'playButton',
  ],
  base: {
    container: {
      position: 'relative',
      height: 'var(--height)',
      aspectRatio: '16 / 9',
    },
    thumbnailWrapper: {
      height: '100%',
      aspectRatio: '16 / 9',
      transition: 'opacity 600ms ease-in-out, visibility 600ms ease-in-out',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    },
    videoWrapper: {
      height: '100%',
      aspectRatio: '16 / 9',
      transition: 'opacity 600ms ease-in-out, visibility 600ms ease-in-out',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    },
    playerContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    clickOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 2,
      cursor: 'pointer',
    },
    chatBubbleWrapper: {
      position: 'absolute',
      bottom: '[2.1rem]',
      left: '[5.5rem]',
      zIndex: 3,
      opacity: 0,
      transform: 'scale(0.6) rotate(6deg)',
      cursor: 'pointer',
      animation:
        'chatBubbleAnimation 300ms token(easings.extreme.standard) 1000ms forwards',
    },
    chatBubble: {
      position: 'relative',
    },
    chatBubbleContent: {
      width: '[11.125rem]',
      textStyle: 'Semantics/Heading/Regular',
      color: 'core.candy.100',
      position: 'absolute',
      bottom: 'space.24',
      left: '50%',
      transform: 'translate(-50%, 0%)',
      textAlign: 'center !important',
      marginBottom: 'space.2',
    },
    playButtonWrapper: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 3,
    },
    playButton: {
      cursor: 'pointer',
      color: 'semantic.surface.light.white',
    },
  },
  variants: {
    showVideo: {
      true: {
        thumbnailWrapper: {
          opacity: 0,
          visibility: 'hidden',
        },
        videoWrapper: {
          opacity: 1,
          visibility: 'visible',
        },
      },
      false: {
        thumbnailWrapper: {
          opacity: 1,
          visibility: 'visible',
        },
        videoWrapper: {
          opacity: 0,
          visibility: 'hidden',
        },
      },
    },
    playPauseOnHover: { true: {}, false: {} },
    isMobile: {
      true: {
        container: {
          width: '100vw',
          height: '100%',
          aspectRatio: '16 / 9',
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    showVideo: false,
    playPauseOnHover: false,
  },
});

export const chatBubbleAnimation = {
  '0%': {
    opacity: 0,
    transform: 'scale(0.6) rotate(6deg)',
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1) rotate(0deg)',
  },
};
