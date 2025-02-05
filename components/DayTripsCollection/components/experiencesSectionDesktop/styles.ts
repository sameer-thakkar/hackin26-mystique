import { sva } from '@headout/pixie/css';

const widthStyles = {
  maxWidth: '75rem',
  minWidth: '62.5rem',
};

export const experiencesSectionStylesRecipe = sva({
  slots: [
    'root',
    'title',
    'fullWidthProductCardsContainer',
    'gridProductCardsContainer',
    'firstContainer',
    'secondContainer',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop: 'space.32',
      ...widthStyles,
    },
    title: {
      ...widthStyles,
      marginBottom: 'space.24',
    },
    fullWidthProductCardsContainer: {
      ...widthStyles,
      display: 'flex',
      flexDirection: 'column',
      gap: 'space.40',
    },
    gridProductCardsContainer: {
      ...widthStyles,
    },
    firstContainer: {
      marginBottom: 'space.64',
    },
    secondContainer: {
      marginTop: 'space.64',
    },
  },
});
