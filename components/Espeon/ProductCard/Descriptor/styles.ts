import { cva } from '@headout/pixie/css';

export const descriptorWrapperStyle = cva({
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'space.6',
    // @TODO: text component fix awaiting.
    textStyle: 'Semantics/UI Label/Regular',
    color: 'semantic.text.grey.2',

    '& svg': {
      w: '0.875rem',
      h: '0.875rem',
      mt: 'space.2',
    },
    '&.underlined > span': {
      borderBottom: 'solid 1px token(colors.semantic.text.grey.2)',
      borderStyle: 'dashed',
    },
  },
  variants: {
    consumer: {
      default: {
        textStyle: 'Semantics/UI Label/Regular',
      },
      small: {
        textStyle: 'Semantics/UI Label/Small',
      },
    },
  },
});
