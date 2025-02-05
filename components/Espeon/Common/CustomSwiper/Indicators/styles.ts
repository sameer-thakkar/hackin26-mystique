import { css, cva } from '@headout/pixie/css';

const paginationDotsBase = css.raw({
  display: 'flex',
  justifyContent: 'center',
  position: 'absolute',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const paginationDotsWrapper = cva({
  base: paginationDotsBase,
  variants: {
    dotsPosition: {
      standard: {
        bottom: '0.75rem',
        left: 0,
        right: 0,
      },
    },
  },
  defaultVariants: {
    dotsPosition: 'standard',
  },
});

export const paginationDotWrapperStyles = cva({
  base: {
    transition: 'transform 0.5',
    width: '6px',
    height: '6px',
    marginRight: 'space.4',
    borderRadius: 'radius.50p',
    backgroundColor: 'semantic.surface.light.white',
  },
  variants: {
    state: {
      default: {
        opacity: 'opacity.40',
      },
      active: {
        opacity: 'opacity.100',
      },
    },
  },
});

export const rtlDirection = css.raw({
  flexDirection: 'row-reverse',
});
