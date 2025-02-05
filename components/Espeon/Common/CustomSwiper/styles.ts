import { css, cva } from '@headout/pixie/css';
import type { SystemStyleObject } from '@headout/pixie/types';

const containerBase = css.raw({
  position: 'relative',
  height: '100%',
  overflow: 'hidden',
});

export const container = cva({
  base: containerBase,
  variants: {
    consumer: {
      carouselGallery: {
        height: '100%',
        width: '100%',
        rounded: 'radius.8',
        position: 'absolute',
        top: '0',
        left: '0',
      },
      tourVariantCarousel: {
        overflow: 'initial',
      },
    },
  },
});

export const buttonWrapperBase = css.raw({
  backgroundColor: 'semantic.surface.light.white',
  position: 'absolute',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  zIndex: 2,
  boxShadow: 'rgb(0 0 0 / 15%) 0px 2px 5px 0px',
  borderColor: 'transparent',
  top: 'var(--top)',
  borderRadius: 'radius.50p',
});

export const buttonWrapper = cva({
  base: buttonWrapperBase,
  variants: {
    alignment: {
      left: {
        left: 'var(--left)',
      },
      right: {
        right: 'var(--right)',
      },
    },
    isOnEdge: {
      true: {},
      false: {},
    },
    size: {
      small: {
        height: '[1.5rem]',
        width: '[1.5rem]',
      },
      medium: {
        height: '[2rem]',
        width: '[2rem]',
      },
    },
  },
  defaultVariants: {
    alignment: 'left',
    size: 'medium',
  },
  compoundVariants: [
    {
      isOnEdge: true,
      alignment: 'left',
      css: {
        left: 0,
      },
    },
    {
      isOnEdge: true,
      alignment: 'right',
      css: {
        right: 0,
      },
    },
  ],
});

const slidesWrapperPseudoElementsBaseStyles: SystemStyleObject = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  height: '100%',
  width: '6.25rem',
  content: "''",
  zIndex: '2',
  display: 'none',
  pointerEvents: 'none',
};

export const slidesWrapper = cva({
  base: {
    height: '100%',
    width: '100%',
    display: 'flex',
    overflowX: 'scroll',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
      height: 0,
    },
    flexDirection: 'row',
    _before: {
      ...slidesWrapperPseudoElementsBaseStyles,
      left: '0',
      background:
        'linear-gradient(90deg,#ffffff 25%, rgba(255, 255, 255, 0) 100%)',
    },
    _after: {
      ...slidesWrapperPseudoElementsBaseStyles,
      right: '0',
      background:
        'linear-gradient(270deg,#ffffff 25%,rgba(255, 255, 255, 0) 100%)',
    },
  },

  variants: {
    enablePrev: {
      true: {
        _before: {
          display: 'block',
        },
      },
      false: {
        _before: {
          display: 'none',
        },
      },
    },
    enableForward: {
      true: {
        _after: {
          display: 'block',
        },
      },
      false: {
        _after: {
          display: 'none',
        },
      },
    },
    rtlEnabled: {
      true: {
        flexDirection: 'row-reverse',
      },
    },
    isSnapScrolling: {
      true: {
        scrollSnapType: 'x mandatory',
      },
    },
  },
});

export const slideWrapper = cva({
  base: {
    display: 'flex',
    width: 'auto',
    '.last + &': { marginRight: 'space.16' },
    '& > :first-child': {
      width: '100%',
    },
    '& img': {
      width: '100%',
    },
  },
  variants: {
    enableLastChildMargin: {
      true: {
        marginRight: 'space.2',
      },
    },
    shouldSnapScroll: {
      true: {
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      },
    },
  },
});

export const clickableCursor = css.raw({
  cursor: 'pointer',
});
