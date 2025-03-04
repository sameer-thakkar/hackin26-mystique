import { sva } from '@headout/pixie/css';

export const radioStyles = sva({
  slots: ['container', 'input', 'control', 'label'],
  base: {
    container: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',

      '@media(max-width: 768px)': {
        padding: '16px 0',
      },
    },
    input: {
      position: 'absolute',
      opacity: '0',
      width: '20px',
      height: '20px',
      margin: '0',
      cursor: 'pointer',
    },
    control: {
      position: 'relative',
      display: 'inline-block',
      width: '20px',
      height: '20px',
      borderRadius: 'radius.50p',
      border: '1px solid token(colors.semantic.icon.grey.disabled.2)',
      transform: 'scale(1)',
      boxSizing: 'border-box',
      transition: 'border 0.3s',

      '&[data-active="true"]': {
        border: '6px solid token(colors.core.primary.purps)',
      },
    },
    label: {
      cursor: 'pointer',
      textStyle: 'Semantics/Subheading/Regular',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'space.8',
      flexDir: 'row',

      '@media(max-width: 768px)': {
        textStyle: 'Semantics/Subheading/Large',
      },
    },
  },
  variants: {
    spacedOut: {
      true: {
        container: {
          width: '-webkit-fill-available',
        },
        label: {
          justifyContent: 'space-between',
          width: '100%',
        },
      },
    },
  },
});
