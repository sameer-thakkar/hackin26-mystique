import { sva } from '@headout/pixie/css';

export const categoryLabelStyles = sva({
  slots: ['root', 'label'],
  base: {
    root: {
      display: 'flex',
      flexDir: 'row',
      alignItems: 'center',
    },
    label: {
      textStyle: 'Semantics/UI Label/Small',
      fontWeight: '400',
      '@media only screen and (min-width: 768px)': {
        fontFamily: 'font.family.ht',
        fontSize: 'font.size.15',
        fontWeight: '300',
        lineHeight: 'lh.20',
        // @TODO: Add this token in Pixie
      },
    },
  },
});
