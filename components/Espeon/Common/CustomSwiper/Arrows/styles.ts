import { css, cva } from '@headout/pixie/css';

const buttonWrapperBase = css.raw({
  backgroundColor: 'semantic.surface.light.white',
  position: 'relative',
  borderRadius: 'radius.50p',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
  height: '[2rem] !important',
  width: '[2rem] !important',
  border: '1px solid',
  borderColor: 'core.grey.300',
  '& svg': {
    width: '[1rem]',
    height: '[1rem]',
    '& path': {
      stroke: 'core.grey.700',
    },
  },
  _first: {
    '& svg': {
      marginRight: '[0.0625rem]',
    },
  },

  _last: {
    '& svg': {
      marginLeft: '[0.0625rem]',
    },
  },
  _hover: {
    borderColor: 'core.grey.400',
  },
  _disabled: {
    '& svg > path': {
      stroke: 'core.grey.300',
    },

    _hover: {
      borderColor: 'core.grey.300',
    },
  },
});

export const buttonWrapper = cva({
  base: buttonWrapperBase,
  variants: {
    alignment: {
      left: {
        left: '0',
      },
      right: {
        right: '0',
      },
    },
  },
  defaultVariants: {
    alignment: 'left',
  },
});
