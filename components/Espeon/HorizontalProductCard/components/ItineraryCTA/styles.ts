import { sva } from '@headout/pixie/css';

export const itineraryCTAStylesRecipe = sva({
  slots: ['container', 'CTAContent'],
  base: {
    container: {
      display: 'grid',
      cursor: 'pointer',
      padding: '0',
      borderRadius: 'radius.12',
      border: '1px solid token(colors.core.white.a20)',
      backgroundClip: 'padding-box',
      boxShadow: '0px 4px 4px 0px token(colors.core.black.a20)',
      transition: 'bottom ease-in-out 150ms, transform ease-in-out 150ms',
      '&:active': {
        transform: 'scale(0.98)',
      },
      '& > svg': {
        borderRadius: 'radius.12',
      },
    },
    CTAContent: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'space.2',
      height: '100%',
      '& > span': {
        width: '3.625rem',
        wordWrap: 'break-word',
        color: 'core.purps.700',
        textStyle: 'Semantics/UI Label/Small (Heavy)',
      },
    },
  },
});
