import { sva } from '@headout/pixie/css';

export const bottomSheetStylesRecipe = sva({
  slots: [
    'overlay',
    'backdrop',
    'sheetContent',
    'sheetWrapper',
    'grabBar',
    'grabIndicator',
  ],
  base: {
    overlay: {
      position: 'fixed',
      left: '[0]',
      height: '[100vh]',
      width: '[100%]',
      zIndex: 105,

      '@supports(height: 100dvh)': {
        height: '[100dvh]',
      },
    },
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '[100vh]',
      width: '[100vw]',
      background: '[rgba(17, 17, 17, 0.35)]',
      opacity: 'var(--backdropOpacity)',
      transition: '[all 300ms cubic-bezier(0, 0, 0.3, 1)]',
    },
    sheetContent: {
      zIndex: 0,
    },
    sheetWrapper: {
      position: 'fixed',
      top: '[auto]',
      left: 0,
      right: 0,
      bottom: 0,
      transform: '[translateY(var(--transformY))]',
      transition: '[transform 350ms cubic-bezier(0, 0, 0.3, 1)]',
      maxHeight: 'var(--sheetHeight)',
      height: 'var(--sheetHeight)',
      backgroundColor: 'core.primary.white',
      boxShadow: '[0 -0.125rem 0.625rem rgba(0, 0, 0, 0.1)]',
      overflow: 'hidden',
    },
    grabBar: {
      width: '[100%]',
      height: '[1rem]',
      cursor: 'grab',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10001,
      background: 'core.primary.white',
    },
    grabIndicator: {
      height: '[0.25rem]',
      width: '[3.375rem]',
      backgroundColor: 'core.grey.300',
      borderRadius: 'radius.4',
      position: 'absolute',
      top: '[0.5rem]',
      left: '[50%]',
      transform: '[translateX(-50%)]',
    },
  },
  variants: {
    hasRoundedCorners: {
      true: {
        sheetWrapper: {
          borderRadius: '[token(radii.radius.16) token(radii.radius.16) 0 0]',
        },
      },
      false: {
        sheetWrapper: {
          borderRadius: 'radius.0',
        },
      },
    },
    hasTransparentGrabBar: {
      true: {
        grabBar: {
          background: 'transparent',
        },
      },
    },
    isOverHeader: {
      true: {
        overlay: {
          zIndex: 100001,
        },
      },
    },
  },
});
