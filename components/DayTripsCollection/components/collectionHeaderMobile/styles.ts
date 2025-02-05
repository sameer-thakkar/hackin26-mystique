import { sva } from '@headout/pixie/css';

export const collectionHeaderMobileRecipe = sva({
  slots: [
    'root',
    'content',
    'carouselContainer',
    'header',
    'subtext',
    'jumpLinks',
    'carouselPositioner',
  ],
  base: {
    root: {
      paddingX: 'space.16',
      display: 'flex',
      flexDirection: 'column',
    },
    carouselContainer: {
      borderRadius: 'radius.20',
      position: 'relative',
      marginTop: 'space.16',
      width: '100%',
      aspectRatio: '16/10',
    },
    carouselPositioner: {
      width: '100%',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
    header: {
      textStyle: 'Semantics/Display/XS',
      color: 'semantic.text.grey.1',
    },
    subtext: {
      textStyle: 'Semantics/Para/Small',
      color: 'semantic.text.grey.3',
      marginTop: 'space.8',
    },
    jumpLinks: {
      marginTop: 'space.24',
    },
  },
});
