import { sva } from '@headout/pixie/css';

export const whyWithHORecipe = sva({
  slots: ['root', 'container', 'title'],
  base: {
    root: {},
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  variants: {
    isDesktop: {
      true: {
        container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          flexWrap: 'nowrap',
          gap: 'space.24',
        },
        title: {
          textStyle: 'Semantics/Display/XS',
          marginBottom: 'space.24',
        },
      },
      false: {
        container: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'space.16',
          overflowX: 'auto',
          width: '[100vw]',
          paddingLeft: 'space.16',
          scrollPaddingLeft: 'space.16',
          scrollBehavior: 'smooth',
          paddingBottom: 'space.6',
        },
        title: {
          textStyle: 'Semantics/Heading/Regular',
          marginBottom: 'space.16',
          marginLeft: 'space.16',
        },
      },
    },
  },
  defaultVariants: {
    isDesktop: true,
  },
});
