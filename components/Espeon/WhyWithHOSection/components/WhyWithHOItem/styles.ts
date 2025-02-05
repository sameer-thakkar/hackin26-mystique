import { sva } from '@headout/pixie/css';

export const whyWithHOItemRecipe = sva({
  slots: ['root', 'image', 'title', 'description'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flex: '0 0 auto',
    },
    image: {
      marginBottom: 'space.12',
      height: 'auto !important', // TODO: Discuss ?
    },
    title: {
      marginBottom: 'space.4',
      color: 'semantic.text.grey.2',
    },
    description: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '[-webkit-box]',
      lineClamp: 3,
      color: 'semantic.text.grey.3',
    },
  },
  variants: {
    isDesktop: {
      true: {
        root: {
          width: '[17.625rem]',
          flex: '0 0 auto',
        },
        title: {
          textStyle: 'Semantics/Heading/Regular',
        },
        description: {
          textStyle: 'Semantics/Para/Medium',
        },
      },
      false: {
        root: {
          width: '[14rem]',
          flex: '0 0 auto',
        },
        title: {
          textStyle: 'Semantics/Heading/Small',
        },
        description: {
          textStyle: 'Semantics/Para/Small',
        },
      },
    },
  },
  defaultVariants: {
    isDesktop: true,
  },
});
