import { sva } from '@headout/pixie/css';

export const navigationButtonsStylesRecipe = sva({
  slots: ['container', 'arrowButton'],
  base: {
    container: {
      display: 'flex',
      marginLeft: 'space.16',
    },
    arrowButton: {
      width: '[1.5rem]',
      height: '[1.5rem]',
      background: 'transparent',
      borderRadius: 'radius.50p',
      borderColor: 'core.grey.300',

      '& svg': {
        width: '12px',
        height: '12px',

        '& path': {
          stroke: 'core.grey.700',
        },
      },

      _first: {
        marginRight: 'space.8',

        '& svg': {
          marginRight: 'space.1',
        },
      },

      _last: {
        '& svg': {
          marginLeft: 'space.1',
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
    },
  },
});
