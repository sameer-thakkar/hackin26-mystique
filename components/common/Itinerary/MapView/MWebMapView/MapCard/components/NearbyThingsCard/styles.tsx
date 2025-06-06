import { sva } from '@headout/pixie/css';

export const nearbyThingsCardStylesRecipe = sva({
  slots: [
    'root',
    'heading',
    'bgImageOverlay',
    'iconContainer',
    'bgImageContainer',
  ],
  base: {
    root: {
      height: '[3.75rem]',
      width: '[6rem]',
      padding: 'space.6',
      borderRadius: 'radius.6',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'core.grey.900',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      scrollSnapAlign: 'start',
      cursor: 'pointer',
    },
    heading: {
      position: 'relative',
      zIndex: 3,
      lineClamp: 2,
      textStyle: 'ui.label.small.heavy',
      color: 'core.primary.white',
    },
    bgImageContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      height: '[100%]',
      width: '[100%]',
    },
    bgImageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2,
      background: 'transparent',
      height: '[100%]',
      width: '[100%]',
    },
    iconContainer: {
      position: 'relative',
      zIndex: 3,
    },
  },
  variants: {
    isSelected: {
      true: {
        root: {
          justifyContent: 'space-between',
        },
        bgImageOverlay: {
          background: 'semantic.surface.dark.primary.1',
        },
      },
    },
    hasImage: {
      true: {
        bgImageOverlay: {
          background: '[#0000006B]',
        },
      },
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      hasImage: true,
      css: {
        bgImageOverlay: {
          background: '[#150029E5]',
        },
      },
    },
  ],
});
