import { sva } from '@headout/pixie/css';

export const collectionHeaderDesktopRecipe = sva({
  slots: [
    'root',
    'content',
    'carousel',
    'header',
    'subtext',
    'jumpLinks',
    'carouselPositioner',
  ],
  base: {
    root: {
      display: 'flex',
      gap: 'space.24',
      maxWidth: '75rem',
      minWidth: '63.5rem',
      marginTop: 'space.24',
      width: '100%',
      justifyContent: 'space-between',
    },
    carousel: {
      display: 'flex',
      borderRadius: 'border.radius.24',
      position: 'relative',
    },
    header: {
      display: 'block',
      textStyle: 'Semantics/Display/Medium',
      color: 'semantic.text.grey.1',
    },
    subtext: {
      textStyle: 'Semantics/Para/Medium',
      color: 'semantic.text.grey.3',
      marginTop: 'space.8',
    },
    jumpLinks: {
      marginTop: 'space.32',
      '& span': {
        display: 'flex',
      },
    },
    content: {
      paddingTop: 'space.32',
    },
  },
  variants: {
    hasMedia: {
      true: {
        header: {
          maxWidth: '[36.5rem]',
        },
        subtext: {
          maxWidth: '[34rem]',
        },
      },
      false: {
        root: {
          marginBottom: 'space.32',
        },
        header: {
          maxWidth: '[39.5rem]',
        },
        subtext: {
          maxWidth: '[36.5rem]',
        },
      },
    },
  },
});
