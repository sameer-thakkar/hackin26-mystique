import { sva } from '@headout/pixie/css';

export const productCardStyles = sva({
  slots: [
    'mainWrapper',
    'mediaContent',
    'mainContent',
    'info',
    'highlights',
    'descriptorsContent',
    'productTitle',
    'itineraryEntryPoint',
    'pricingSection',
    'descriptorsList',
    'headerAnchor',
    'itineraryCTA',
  ],
  base: {
    mainWrapper: {
      bgColor: 'semantic.surface.light.white',
      rounded: 'radius.16',
      p: 'space.12',
      transition: `transform 300ms cubic-bezier(0.7, 0, 0.3, 1),
				top 300ms cubic-bezier(0.7, 0, 0.3, 1)`,
      display: 'flex',
      flexDirection: 'column',
      '&.shrinked': {
        transform: 'scale(.95)',
      },
    },
    mediaContent: {
      position: 'relative',
      rounded: 'radius.12',
      bg: 'semantic.surface.light.grey.3',
      width: '100%',
      maxW: '36.2rem',
      '& .custom-swiper-slides-wrapper': {
        aspectRatio: 1.6,
      },
    },
    mainContent: {
      mt: 'space.12',
      display: 'flex',
      flexDir: 'column',
      gap: 'space.16',
      flex: 1,
    },
    info: {
      display: 'flex',
      flexDir: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      height: '100%',
      flex: 1,
      marginBottom: 'space.2',
    },
    highlights: {
      display: 'none',
    },
    descriptorsContent: {
      margin: 'token(spacing.space.4) 0 token(spacing.space.8) 0',
      position: 'relative',
      '@media only screen and (min-width: 768px)': {
        width: 'max-content',
      },
    },
    // @TODO: text component fix awaiting.
    productTitle: {
      textStyle: 'Semantics/Heading/Regular',
      color: 'semantic.text.grey.1',
    },
    itineraryEntryPoint: {
      position: 'absolute',
    },
    pricingSection: {
      height: 'max-content',
      flex: 2,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    descriptorsList: {
      mt: 'space.4',
      rowGap: 'space.6',
      columnGap: 'space.6',
    },
    headerAnchor: {
      textDecoration: 'none',
      cursor: 'text',
    },
    itineraryCTA: {
      position: 'absolute',
      bottom: '[0.5rem]',
      right: '[0.5rem]',
      zIndex: '1',
      _hover: {
        '@media (min-width: 768px)': {
          bottom: 'calc(0.5rem - 1px)',
        },
      },
    },
  },
  variants: {
    isDesktop: {
      true: {
        mainWrapper: {
          position: 'relative',
          maxWidth: '[22.375rem]',
          paddingBottom: 'space.16',
          flex: 1,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'semantic.dividers.dark',
          top: '0',
          _hover: {
            top: ['-0.1875rem'],
          },
        },
        descriptorsList: {
          maxWidth: '[22.375rem]',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
        },
        mainContent: {
          gap: 'space.16',
        },
      },
      false: {
        mainWrapper: {
          boxShadow: '0px 1px 6px 1px #1111111A, 0px 1px 4px 0px #1111110D',
        },
      },
    },
    overrideDescriptors: {
      true: {
        descriptorsContent: {
          display: 'flex',
          flexDirection: 'column',
          rowGap: 'space.12',
          marginBottom: '0',
          '@media only screen and (min-width: 768px)': {
            width: 'auto',
          },
        },
      },
    },
  },
});
