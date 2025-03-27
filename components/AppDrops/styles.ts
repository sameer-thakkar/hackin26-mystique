import { css } from '@headout/pixie/css';

export const bannerContainer = css({
  maxWidth: '75rem',
  margin: '0 1.5rem',
  borderRadius: '16px',
  background: 'linear-gradient(to right, #FFDDE2, #FFF5EB)',
  position: 'relative',
  minHeight: '30.125rem',

  '@media (min-width: 768px)': {
    width: '100%',
    margin: '0 auto',
    minHeight: '13.125rem',
  },
});

export const mobileSection = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.75rem',
});

export const bannerContent = css({
  display: 'flex',
  flexDirection: 'column-reverse',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '1rem',

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    padding: '2rem',
  },
});

export const leftSection = css({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '36rem',
  marginTop: '13.75rem',

  '@media (min-width: 768px)': {
    marginTop: '0',
    padding: '0',
  },
});

export const rightSection = css({
  position: 'absolute',
  top: '3.125rem',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '12.5rem',
  width: '20.375rem',

  '@media (min-width: 768px)': {
    top: 'auto',
    bottom: '0',
    right: '0',
    transform: 'scale(0.75)',
    transformOrigin: 'bottom right',
    transition: 'transform 0.5s cubic-bezier(0.7, -0.2, 0.3, 1.2)',
    height: '21.375rem',
    width: '37.25rem',
  },
});

export const title = css({
  margin: '1rem 0 0.25rem 0 !important',
  '@media (max-width: 767px)': {
    boxShadow: '-0.0625rem -0.4375rem 1.25rem 0px #ffefc6e0',
  },
});

export const subtitle = css({
  marginBottom: '1rem',
});

export const ctaButton = css({
  '@media (min-width: 768px)': {
    width: 'fit-content',
  },
});

export const leftSectionAppNudge = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const titleAppNudge = css({
  fontWeight: 'bold',
});

export const expandedContainer = css({
  transition: 'height 0.3s ease-in-out',
});

export const expandedRightSection = css({
  transform: 'scale(1.1) !important',
  transition: 'transform 0.5s cubic-bezier(0.7, -0.2, 0.3, 1.2)',
});

export const collapseButton = css({
  position: 'absolute',
  bottom: '1rem',
  right: '1rem',
  width: '2rem',
  height: '2rem',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
  border: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  rotate: '180deg',
  zIndex: 1,
  transition: 'transform 0.2s ease-in-out',

  '&:hover': {
    transform: 'translateY(-0.125rem)',
  },
});

export const animatedNudgeContainer = css({
  overflow: 'hidden',
  transition:
    'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
});

export const nudgeVisible = css({
  maxHeight: '31.25rem',
  opacity: 1,
  transform: 'translateY(0)',
});

export const nudgeHidden = css({
  maxHeight: '0',
  opacity: 0,
  transform: 'translateY(-1.25rem)',
});
