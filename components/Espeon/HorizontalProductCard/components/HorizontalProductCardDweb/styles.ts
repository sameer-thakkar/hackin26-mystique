import { sva } from '@headout/pixie/css';

export const productCardStyles = sva({
  slots: [
    'mainWrapper',
    'mediaContent',
    'mainContent',
    'headerContent',
    'descriptorsContent',
    'footer',
    'cta',
    'headerAnchor',
    'itineraryCTA',
  ],
  base: {
    mainWrapper: {
      bgColor: 'semantic.surface.light.white',
      rounded: 'radius.12',
      p: 'space.12',
      border: '1px solid token(colors.semantic.dividers.dark)',
      display: 'flex',
      gap: 'space.20',
    },
    mediaContent: {
      position: 'relative',
      rounded: 'radius.8',
      width: '100%',
      maxW: '36.2rem',
      '& .custom-swiper-slides-wrapper': {
        height: '22.625rem',
        overflowY: 'hidden',
      },
    },
    mainContent: {
      width: '100%',
      display: 'flex',
      flexDir: 'column',
      gap: 'space.10',
      justifyContent: 'space-between',
    },
    headerContent: {
      display: 'flex',
      flexDir: 'column',
      gap: 'space.4',
      marginBottom: 'space.8',
    },
    descriptorsContent: {
      margin: 'token(spacing.space.4) 0 token(spacing.space.12) 0',
      width: 'max-content',
      position: 'relative',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingTop: 'space.10',
      borderTop: '0.8px solid token(colors.semantic.dividers.dark)',
    },
    cta: {
      w: '224px',
    },
    headerAnchor: {
      textDecoration: 'none',
      cursor: 'text',
    },
    itineraryCTA: {
      position: 'absolute',
      top: '[17.1875rem]',
      right: '[0.5rem]',
      zIndex: '1',
      _hover: {
        '@media (min-width: 768px)': {
          top: 'calc(17.1875rem - 1px)',
        },
      },
    },
  },
  variants: {
    overrideDescriptors: {
      true: {
        descriptorsContent: {
          display: 'flex',
          flexDirection: 'column',
          rowGap: 'space.10',
          margin: 'token(spacing.space.8) 0 token(spacing.space.10) 0',
          width: 'auto',
        },
      },
    },
  },
});
