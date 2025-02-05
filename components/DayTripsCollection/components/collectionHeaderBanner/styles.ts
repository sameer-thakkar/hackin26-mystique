import { sva } from '@headout/pixie/css';

export const collectionHeaderBannerRecipe = sva({
  slots: ['root', 'navigation'],
  base: {
    root: {
      width: '522px',
      aspectRatio: '16 / 10',
      // margin: '0.75rem 0',
    },
    navigation: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'space.8',
      zIndex: 2,
      marginTop: 'space.16',
      '& .arrow-button': {
        borderColor: 'core.grey.300 !important',
        borderRadius: 'radius.50p',
      },
    },
  },
  variants: {
    isMobile: {
      true: {
        root: {
          width: '100%',
        },
      },
    },
  },
});
