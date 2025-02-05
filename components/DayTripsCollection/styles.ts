import { sva } from '@headout/pixie/css';

export const dayTripsCollectionPageRecipe = sva({
  slots: [
    'root',
    'reviewSectionContainer',
    'floatingActionButtonContainer',
    'floatingActionButton',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    reviewSectionContainer: {
      margin: 'auto auto 0px',
      maxWidth: '75rem',
      width: '100%',
    },
    floatingActionButtonContainer: {
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      left: 0,
      zIndex: 11,
      bottom: 0,
      transition:
        'transform 0.2s cubic-bezier(0, 0, 0.3, 1), bottom 0.2s cubic-bezier(0.7, 0, 0, 1)',
    },
    floatingActionButton: {
      width: 'auto',
      boxShadow:
        '0px -2px 2px 0px rgba(255, 255, 255, 0.20) inset, 0px 2px 12px -2px rgba(0, 0, 0, 0.20)',
    },
  },
  variants: {
    isDesktop: {
      false: {
        root: {
          paddingY: 'space.24',
        },
        reviewSectionContainer: {
          width: 'calc(100vw - 32px)',
          paddingInline: 'space.16',
          paddingTop: 'space.48',
          paddingBottom: 'space.24',
          '& .heading-container': {},
          '& .mobile-carousel-container': {
            scrollPaddingLeft: 'space.16',
            paddingBottom: 'space.8',
          },
        },
      },
      true: {
        reviewSectionContainer: {
          padding: '4.5rem 0px 2.625rem',
        },
      },
    },
    showFloatingActionButton: { true: {}, false: {} },
  },
  compoundVariants: [
    {
      isDesktop: true,
      showFloatingActionButton: true,
      css: {
        floatingActionButtonContainer: {
          transform: 'translateY(-2rem)',
        },
      },
    },
    {
      isDesktop: true,
      showFloatingActionButton: false,
      css: {
        floatingActionButtonContainer: {
          bottom: '-space.48',
        },
      },
    },
    {
      isDesktop: false,
      showFloatingActionButton: true,
      css: {
        floatingActionButtonContainer: {
          transform: 'translateY(-2rem)',
        },
      },
    },
    {
      isDesktop: false,
      showFloatingActionButton: false,
      css: {
        floatingActionButtonContainer: {
          bottom: '-space.40',
        },
      },
    },
  ],
});
