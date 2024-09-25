import { css } from '@headout/pixie/css';

export const containerStyle = css({
  backgroundColor: '#123941',
  borderRadius: 'radius.16',
  height: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  boxSizing: 'border-box',
  position: 'relative',
  '@media (max-width: 768px)': {
    borderRadius: 'radius.8',
    minHeight: '7.25rem',
  },
});

export const customerImagesContainerStyle = css({
  display: 'flex',
  zIndex: 1,
  position: 'absolute',
  top: '1.25rem',
  left: '1.25rem',

  '& image-wrap': {
    width: '2.375rem',
    height: '2.375rem',
  },
  '&  img': {
    width: '2.375rem',
    height: '2.375rem',
  },

  '@media (max-width: 768px)': {
    display: 'none',
  },
});

export const customerImageStyle = css({
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.50)',
  height: '38px!',
  width: '38px!',
  '& img': {
    borderRadius: '50%',
  },
});

export const overlappingImageStyle = css({
  marginLeft: '-0.5rem',
});

export const backgroundImageStyle = css({
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  position: 'absolute!',
  borderRadius: 'radius.16',

  '& img': {
    borderRadius: 'radius.16',
    objectFit: 'cover',
  },

  display: 'none',

  '@media (max-width: 768px)': {
    borderRadius: 'radius.8',
    display: 'block',
    '& img': {
      borderRadius: 'radius.8',
    },
  },
});

export const bookmarkHeartStyle = css({
  position: 'absolute',
  top: '0',
  right: '1.5rem',

  '@media (max-width: 768px)': {
    display: 'none',
  },
});

export const contentContainerStyle = css({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
  marginTop: 'auto',
  padding: '1.25rem',
  paddingTop: '.5rem',
  borderRadius: '0 0 16px 16px',

  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0,
    padding: '1.75rem 0.75rem 0.75rem',
    width: '100%',
    borderRadius: '0 0 8px 8px',
    background:
      'linear-gradient(180deg, rgba(18, 57, 65, 0) 0%, #123941 58.99%)',
  },
});

export const numberStyle = css({
  fontSize: '48px',
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
  maxWidth: '40%',
  margin: 0,
  marginTop: '0.25rem',

  '@media (max-width: 768px)': {
    textStyle: 'Semantics/UI Label/Small (Heavy)',
    marginTop: '0',
    maxWidth: '100%',
  },
});
