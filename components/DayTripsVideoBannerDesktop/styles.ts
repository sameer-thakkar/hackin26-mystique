import { sva } from '@headout/pixie/css';

export const dayTripsStyles = sva({
  slots: [
    'wrapper',
    'content',
    'title',
    'description',
    'watchButton',
    'videoSection',
    'blurCircle',
    'circle1',
    'circle2',
    'mask',
  ],
  base: {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'semantic.surface.light.candy.1',
      borderRadius: 'radius.16',
      position: 'relative',
      overflow: 'hidden',
      height: '[20.6875rem]',
      width: '100%',
      maxWidth: '[75rem]',
      margin: 'auto',
    },
    content: {
      maxWidth: '[31.25rem]',
      zIndex: 2,
      marginLeft: '[2.625rem]',
    },
    title: {
      textStyle: 'display.small',
      color: 'semantic.text.grey.1',
      marginBottom: 'space.8',
    },
    description: {
      textStyle: 'para.large',
      color: 'semantic.text.grey.1',
      marginBottom: 'space.24',
    },
    watchButton: {
      width: '[9.25rem]',
    },
    videoSection: {
      position: 'relative',
      zIndex: 1,
      height: '[20.6875rem]',
      aspectRatio: '16/9',
      overflow: 'hidden',
    },
    mask: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      '& svg': {
        position: 'relative',
        left: '[-4.25rem]',
      },
    },
    blurCircle: {
      position: 'absolute',
      backgroundColor: 'semantic.surface.light.candy.2',
      borderRadius: '50%',
      zIndex: 1,
      filter: 'blur(52px)',
    },
    circle1: {
      width: '[18.75rem]',
      height: '[18.75rem]',
      left: '-89px',
      top: '112px',
    },
    circle2: {
      width: '[16.75rem]',
      height: '[16.75rem]',
      left: '390px',
      top: '-98px',
    },
  },
});
