import { sva } from '@headout/pixie/css';

export const experiencesSectionStylesRecipe = sva({
  slots: [
    'root',
    'title',
    'productCardsContainer',
    'firstContainer',
    'secondContainer',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      marginTop: 'space.40',
    },
    title: {
      marginLeft: 'space.16',
      marginBottom: 'space.16',
    },
    productCardsContainer: {
      paddingX: 'space.16',
      display: 'flex',
      flexDirection: 'column',
      gap: 'space.24',
    },
    firstContainer: {
      marginBottom: 'space.32',
    },
    secondContainer: {
      marginTop: 'space.32',
    },
  },
});
