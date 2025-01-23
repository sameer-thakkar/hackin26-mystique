import { sva } from '@headout/pixie/css';

export const mapViewCardStylesRecipe = sva({
  slots: [
    'root',
    'card',
    'headingContainer',
    'heading',
    'nearbyThingsContainer',
    'nearbyThingsHeading',
    'nearbyThingsCarousel',
    'ctaContainer',
    'cta',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'radius.12',
      width: '[calc(100vw - 4.5rem)]',
      flexShrink: 0,
      scrollSnapAlign: 'start',
      height: 'fit-content',
      background: 'semantic.surface.light.grey.3',
      position: 'relative',

      '&:first-child': {
        marginLeft: '[1.5rem]',
      },

      '&:last-child': {
        _after: {
          content: "''",
          position: 'absolute',
          top: 0,
          right: '[-1.5rem]',
          width: '[1.5rem]',
          height: '[100%]',
        },
      },
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'core.primary.white',
      padding: 'space.12',
      border: '1px solid token(colors.semantic.surface.light.grey.1)',
      borderRadius: 'radius.12',
    },
    headingContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'space.8',
      marginBottom: 'space.8',
    },
    heading: {
      textStyle: 'Semantics/Heading/Regular',
      color: 'core.grey.800',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0',
      whiteSpace: 'nowrap',
    },
    nearbyThingsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'space.10',
      marginTop: 'space.16',
    },
    nearbyThingsHeading: {
      textStyle: 'Semantics/Tags/Regular',
      letterSpacing: '[0.2px]',
      color: 'core.grey.700',
      textTransform: 'uppercase',
    },
    nearbyThingsCarousel: {
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'scroll',
      gap: 'space.8',
      scrollSnapType: 'x mandatory',
    },
    ctaContainer: {
      background: 'semantic.surface.light.grey.3',
      borderRadius: '0 0 token(radii.radius.12) token(radii.radius.12)',
      padding: 'token(spacing.space.8) token(spacing.space.12)',
    },
    cta: {
      display: 'flex',
      gap: 'space.4',
      alignItems: 'center',
    },
  },
});
