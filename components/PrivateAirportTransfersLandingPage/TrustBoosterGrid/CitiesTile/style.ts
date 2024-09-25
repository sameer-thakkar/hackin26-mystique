import { css } from '@headout/pixie/css';

export const containerStyle = css({
  backgroundColor: '#18022D',
  borderRadius: 'radius.16',
  height: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  position: 'relative',

  '@media (max-width: 768px)': {
    borderRadius: 'radius.8',
  },
});

export const imageStyle = css({
  width: '100%',
  height: '17.25rem!',
  top: '3.3125rem',
  left: 0,
  position: 'absolute!',
  zIndex: 0,

  '@media (max-width: 768px)': {
    height: '10rem!',
    top: '1.625rem',
  },
});

export const contentWrapperStyle = css({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
  marginTop: 'auto',
  marginLeft: '1rem',
  marginBottom: '1rem',

  '@media (max-width: 768px)': {
    padding: '0.75rem',
    margin: 0,
    gap: '0.375rem',
  },
});

export const headingStyle = css({
  fontSize: 'font.size.48',
  lineHeight: 'lh.54',
  fontFamily: 'font.family.hd',
  margin: '0',
  color: 'core.primary.white',

  '@media (max-width: 768px)': {
    fontSize: 'font.size.30',
    lineHeight: 'lh.38',
  },
});

export const paragraphStyle = css({
  color: 'core.primary.white',
  textStyle: 'Semantics/Subheading/Large',
  maxWidth: '50%',
  margin: 0,

  '@media (max-width: 768px)': {
    textStyle: 'Semantics/UI Label/Small (Heavy)',
  },
});
