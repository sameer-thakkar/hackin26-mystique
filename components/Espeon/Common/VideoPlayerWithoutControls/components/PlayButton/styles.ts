import { cva } from '@headout/pixie/css';

export const playButtonStyles = cva({
  base: {
    width: '[2.25rem]',
    height: '[2.25rem]',
    padding: '[0.5rem 0.4375rem 0.5rem 0.5625rem]',
    borderRadius: 'radius.50p',
    backgroundColor: 'core.primary.white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    cursor: 'pointer',

    '@media (min-width: 768px)': {
      width: '[3.25rem]',
      height: '[3.25rem]',

      '& svg': {
        width: '[1.5rem]',
        height: '[1.5rem]',
      },
    },
  },
});
