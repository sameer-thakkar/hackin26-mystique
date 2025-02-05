import { sva } from '@headout/pixie/css';

export const descriptorItemStyle = sva({
  slots: ['root', 'icon', 'label'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      display: 'flex',
      marginRight: 'space.6',
    },
  },
  variants: {
    variant: {
      long: {
        label: {
          textStyle: 'Semantics/UI Label/Regular',
        },
      },
      short: {
        label: {
          textStyle: 'Semantics/UI Label/Regular',
          '@media (max-width: 768px)': {
            textStyle: 'Semantics/UI Label/Small',
          },
        },
      },
    },
  },
});
