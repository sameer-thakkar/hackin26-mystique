import { css } from '@headout/pixie/css';

export const poiCardStyles = css({
  position: 'relative',
  marginTop: '10px',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  transition: 'transform 0.15s ease-in-out',

  _active: {
    transform: 'scale(0.98)',
  },

  '@media (min-width: 768px)': {
    marginTop: '14px',
    _hover: {
      '& .text-container': {
        height: '75%',
        paddingTop: 'space.16',

        '& .description': {
          maxHeight: '4.5rem',
        },
      },

      '& .inner-card-first': {
        top: '-4px',
      },
      '& .inner-card-second': {
        top: '-8px',
      },
    },
  },
});

export const dummyInnerFirstCardStyles = css({
  position: 'absolute',
  top: '-5px',
  left: 0,
  right: 0,
  height: '100%',
  background: 'semantic.surface.light.white',
  border: '0.5px solid #E2E2E2',
  borderRadius: 'radius.4',
  zIndex: 1,
  width: '89%',
  marginX: 'auto',

  '@media (min-width: 768px)': {
    borderWidth: '1px',
    transition: 'top 0.3s cubic-bezier(0.7, 0, 0.3, 1)',
    top: '-8px',
  },
});

export const dummyInnerSecondCardStyles = css({
  position: 'absolute',
  top: '-10px',
  left: 0,
  right: 0,
  height: '100%',
  background: 'semantic.surface.light.grey.2',
  border: '0.5px solid #E2E2E2',
  borderRadius: 'radius.4',
  zIndex: 0,
  width: '78%',
  marginX: 'auto',

  '@media (min-width: 768px)': {
    borderWidth: '1px',
    transition: 'top 0.3s cubic-bezier(0.7, 0, 0.3, 1)',
    top: '-14px',
  },
});

export const mainCardStyles = css({
  borderRadius: 'radius.8',
  minHeight: '13rem',
  position: 'relative',
  zIndex: 2,
  boxSizing: 'border-box',
  overflow: 'hidden',
  aspectRatio: '156 / 208',

  '@media (min-width: 768px)': {
    height: '22.25rem',
    aspectRatio: '282 / 356',
    border: 'none',
    display: 'flex',
    borderRadius: 'radius.12',
    outline: '1px solid white',
    outlineOffset: '-1px',
    boxSizing: 'border-box!',
  },
});

export const cardImageStyles = css({
  borderRadius: 'radius.4',
  position: 'absolute!',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: -1,

  '& img': {
    objectFit: 'contain',
    height: '100%',
    width: '100%',
  },

  '@media (min-width: 768px)': {
    borderRadius: 'radius.12',
    aspectRatio: '282/356',
  },
});

export const textContainerStyles = css({
  marginTop: 'auto',
  background:
    'linear-gradient(180deg, rgba(18, 0, 35, 0) 47.23%, rgba(18, 0, 35, 0.95) 81.27%)',
  zIndex: 3,
  padding: 'space.8',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  boxSizing: 'border-box',
  transition: 'height 0.3s cubic-bezier(0.7, 0, 0.3, 1)',

  '@media (min-width: 768px)': {
    background:
      'linear-gradient(190.23deg, rgba(21, 1, 42, 0) 14.63%, #15012A 74.25%)',
    padding: 'space.16',
    paddingTop: 'space.80',
    height: '50%',
  },
});

export const ratingsContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  gap: 'space.2',

  '& svg': {
    width: '10px',
    height: '10px',
    transform: 'translateY(0.5px)',
  },
});

export const descriptionTextStyles = css({
  color: 'semantic.surface.light.white',
  textStyle: 'Semantics/Para/Regular',
  lineClamp: 3,
  maxHeight: '0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginTop: 'space.8',
  transition: 'max-height 0.3s cubic-bezier(0.7, 0, 0.3, 1)',
});

export const priceSectionStyles = css({
  display: 'flex',
  gap: 'space.4',
  marginTop: 'space.6',
  alignItems: 'baseline',

  '& span': {
    color: 'semantic.surface.light.white',
  },

  '@media (min-width: 768px)': {
    flexDirection: 'column',
    gap: 'space.4',
    marginTop: '0px',
  },
});

export const fromTextStyles = css({
  textStyle: 'Semantics/UI Label/Small',
  '@media (min-width: 768px)': {
    fontSize: '10px',
    fontWeight: 'normal',
    textStyle: 'Semantics/Para/Extra Small',
  },
});
