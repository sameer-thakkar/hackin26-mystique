import { css } from '@headout/pixie/css';

export const containerStyle = css({
  borderRadius: 'radius.16',
  position: 'relative',
  height: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '13.5rem',

  '@media (max-width: 768px)': {
    borderRadius: 'radius.8',
    minHeight: '7.25rem',
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
    borderRadius: 'radius.8',

    '& img': {
      borderRadius: 'radius.8',
    },
  },
});

export const contentContainerStyle = css({
  display: 'flex',
  zIndex: 1,
  position: 'relative',
  boxSizing: 'border-box',
  gap: '0.75rem',
  padding: '1rem',
  paddingTop: '2.625rem',
  alignItems: 'center',
  marginTop: 'auto',
  background: 'linear-gradient(180deg, rgba(19, 19, 19, 0) 0%, #131313 100%)',
  borderRadius: '0 0 16px 16px',

  '@media (max-width: 768px)': {
    padding: '0.75rem',
    paddingTop: '2rem',
    borderRadius: '0 0 8px 8px',
    background:
      'linear-gradient(180deg, rgba(106, 31, 67, 0) 0%, #6A1F43 100%)',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0,
  },
});

export const headingStyle = css({
  fontSize: 'font.size.48',
  lineHeight: 'lh.54',
  fontFamily: 'font.family.hd',
  margin: '0',
  color: 'core.primary.white',

  '@media (max-width: 768px)': {
    fontSize: 'font.size.24',
    lineHeight: 'lh.28',
  },
});

export const textStyle = css({
  color: 'core.primary.white',
  textStyle: 'Semantics/Subheading/Large',
  maxWidth: '50%',
  margin: 0,
  marginTop: '0.25rem',

  '@media (max-width: 768px)': {
    textStyle: 'Semantics/UI Label/Small (Heavy)',
    marginTop: '0',
    maxWidth: '100%',
  },
});

export const starBadgeStyle = css({
  marginLeft: 'auto',
  zIndex: 1,
  paddingRight: '0.5rem',

  '@media (max-width: 768px)': {
    display: 'none',
  },
});
