import { css } from '@headout/pixie/css';

export const collectionsSectionStyles = css({
  background: 'linear-gradient(96.15deg, #FFECF4 0%, #FEF5E6 99.49%)',
  paddingY: '1.875rem',
  paddingX: 'space.24',
  position: 'relative',
  marginTop: '-space.8',
  overflow: 'hidden',
  marginBottom: 'space.48',

  '@media (min-width: 768px)': {
    paddingTop: '2.25rem',
    paddingBottom: '2.5rem',
    marginTop: '0.625rem',
  },
});
export const topCirclesStyle = css({
  position: 'absolute',
  top: '-10px',
  left: 'space.8',
  right: 0,
  '&[data-is-mobile="true"]': {
    top: '-5px',
  },
});
export const bottomCirclesStyles = css({
  position: 'absolute',
  bottom: '-5px',
  left: 'space.8',
  right: 0,
  '&[data-is-mobile="false"]': {
    bottom: '-10px',
  },
});
export const sectionHeadingStyles = css({
  marginBottom: 'space.12',
  color: '#7D280B',

  textStyle: 'Semantics/Heading/Medium',
  '@media (min-width: 768px)': {
    textStyle: 'Semantics/Display/Small',
    marginBottom: '1.125rem',
  },
});
export const carouselArrowsContainerStyles = css({
  '& svg': {
    cursor: 'pointer',
    width: '2rem',
    height: '2rem',
    fill: 'semantic.cta.white',

    _active: {
      transition: 'scale 0.3s cubic-bezier(0.7, 0, 0.3, 1)',
      scale: '0.95',

      '& circle': {
        stroke: 'semantic.text.grey.2',
        strokeOpacity: '1',
      },
    },

    _hover: {
      '& circle': {
        stroke: 'semantic.text.grey.2',
        strokeOpacity: '1',
      },
    },

    '&.disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',

      '& circle': {
        stroke: 'semantic.cta.disabled.tertiary',
        strokeOpacity: '1',
      },
    },

    '& circle': {
      stroke: '#797979',
      strokeOpacity: '0.5',
    },
  },
});
export const cardsContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 'space.16',

  '@media (min-width: 768px)': {
    display: 'flex',
  },
});
