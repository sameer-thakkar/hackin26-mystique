import { sva } from '@headout/pixie/css';

export const dayTripsStyles = sva({
  slots: [
    'wrapper',
    'headerBox',
    'headerDescription',
    'videoSection',
    'overlayContent',
    'watchButton',
    'blurCircle',
    'circle1',
  ],
  base: {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%',
      backgroundColor: 'transparent',
      padding: 'space.0',
      gap: 'space.0',
      '& .plyr__video-wrapper': {
        borderRadius: 'radius.0 !important',
      },
    },
    headerBox: {
      backgroundColor: 'semantic.surface.light.candy.1',
      paddingBlock: 'space.20',
      paddingInline: 'space.16',
      position: 'relative',
      overflow: 'hidden',
    },
    headerDescription: {
      textStyle: 'heading.regular',
      color: 'semantic.text.grey.1',
      position: 'relative',
      zIndex: 2,
    },
    videoSection: {
      width: '100%',
      position: 'relative',
      aspectRatio: '16/9',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    watchButton: {
      zIndex: 3,
      position: 'absolute',
      width: '[7.875rem]',
    },
    blurCircle: {
      position: 'absolute',
      backgroundColor: 'semantic.surface.light.candy.2',
      borderRadius: '50%',
      zIndex: 1,
      filter: 'blur(20px)',
    },
    circle1: {
      width: '[12.5rem]',
      height: '[12.5rem]',
      right: '-80px',
      top: '-88px',
    },
  },
});
