import { sva } from '@headout/pixie/css';

export const jumpLinkItemRecipe = sva({
  slots: [
    'root',
    'imageContainer',
    'image',
    'content',
    'subtitleContainer',
    'chevron',
  ],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    imageContainer: {
      marginRight: 'space.8',
      width: '[2.5rem]',
      height: '[2.5rem]',
    },
    image: {
      marginRight: 'space.8',
      width: '[2.5rem]',
      height: '[2.5rem]',
      clipPath: `polygon(
				30% 0%, 70% 0%,
				100% 30%, 100% 70%,
				70% 100%, 30% 100%,
				0% 70%, 0% 30%
			)`,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    subtitleContainer: {
      display: 'flex',
      alignItems: 'center',
      columnGap: 'space.4',
    },
    chevron: {
      paddingTop: 'space.1',
      display: 'flex',
    },
  },
  variants: {
    isDesktop: {
      false: {
        image: {
          marginRight: 'space.10',
        },
      },
    },
    isClickable: {
      true: {
        root: {
          cursor: 'pointer',
        },
      },
      false: {
        root: {
          cursor: 'default',
        },
      },
    },
  },
});
