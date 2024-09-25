import { css } from '@headout/pixie/css';

export const containerStyle = css({
  boxSizing: 'border-box',
  height: '100%',
  borderRadius: 'radius.16',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  cursor: 'pointer',
  gap: '7px',
  position: 'relative',
  aspectRatio: '486 / 443',
  overflow: 'hidden',

  '& svg': {
    zIndex: 1,
  },

  '@media (max-width: 768px)': {
    aspectRatio: '343/140',
    height: 'auto',
    padding: '1rem',
    borderRadius: 'radius.8',
  },
});

export const desktopBgSvgStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,

  '@media (max-width: 768px)': {
    display: 'none',
  },
});

export const mobileBgSvgStyle = css({
  position: 'absolute',
  bottom: 0,
  left: 0,
  top: 0,
  zIndex: 0,

  '@media (min-width: 768px)': {
    display: 'none',
  },
});

export const backgroundImageStyle = css({
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  position: 'absolute!',
  zIndex: 0,
  borderRadius: '16px',

  '& img': {
    borderRadius: '16px',
    objectFit: 'cover',
  },

  '@media (max-width: 768px)': {
    borderRadius: '8px',

    '& img': {
      marginLeft: 'auto',
      width: '80%!',
      borderRadius: '8px',
    },
  },
});

export const trustPilotLogoStyle = css({
  margin: '1.25rem',
  '@media (max-width: 768px)': {
    width: '5rem',
    margin: 0,
  },
});

export const contentContainerStyle = css({
  boxSizing: 'border-box',
  marginTop: 'auto',
  zIndex: 1,
  background:
    'linear-gradient(196deg, rgba(1, 1, 1, 0.00) 42.2%, #010101 77.79%)',
  padding: '1.25rem',
  paddingTop: '4.5rem',
  width: '100%',

  '@media (max-width: 768px)': {
    background: 'unset',
    padding: 0,
  },
});

export const ratingStyle = css({
  fontSize: '3.75rem',
  color: 'core.primary.white',
  fontWeight: '500',
  lineHeight: 'lh.54',
  marginBottom: '0.5rem',
  position: 'relative',
  width: 'max-content',
  '& svg': {
    position: 'absolute',
    top: '-0.75rem',
    right: '-1rem',
  },

  '@media (max-width: 768px)': {
    fontSize: '1.5rem',
    lineHeight: 'lh.28',
    marginBottom: 0,

    '& svg': {
      width: '1rem',
      top: '-1rem',
      right: '-.5rem',
    },
  },
});

export const ratingStarsStyle = css({
  zIndex: 1,
  '@media (max-width: 768px)': {
    width: '7.3125rem',
    marginTop: '-4px',
    marginBottom: '-12px',
  },
});
