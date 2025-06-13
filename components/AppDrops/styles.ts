import { css } from '@headout/pixie/css';

export const bannerContainer = css({
  maxWidth: '75rem',
  margin: '0 1.5rem',
  borderRadius: '16px',
  position: 'relative',
  minHeight: '28.75rem',
  border: '1px solid rgba(252, 230, 234, 1)',
  background:
    'radial-gradient(97.12% 293.35% at 0% 7.31%, #FFF7D9 0%, #FFFFFF 100%)',
  '@media (min-width: 768px)': {
    width: '100%',
    margin: '0 auto',
    minHeight: '13.125rem',
    overflow: 'hidden',
  },
});

export const mobileSection = css({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.75rem',
  zIndex: 2,
  width: '100%',
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
    padding: '0px',
  },
});

export const leftSection = css({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '42.5rem',
  marginTop: '2rem',
  zIndex: 2,

  '@media (min-width: 768px)': {
    marginTop: '0',
    padding: '1.5rem 0 1.5rem 1.5rem',
  },
});

export const rightSection = css({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '12.5rem',
  width: '20.375rem',
  zIndex: 2,

  '@media (min-width: 768px)': {
    scale: '1.11',
    height: '20.6rem',
    width: '25.25rem',
  },
});

export const title = css({
  margin: '0.5rem 0 0.25rem 0 !important',
  textAlign: 'center !important',
  '@media (min-width: 768px)': {
    textAlign: 'left !important',
  },
});

export const subtitle = css({
  marginBottom: '0.75rem',
  textAlign: 'center !important',
  '@media (min-width: 768px)': {
    width: 'fit-content',
    textAlign: 'left !important',
  },
});

export const ctaButton = css({
  boxShadow: '-0.0625rem -0.4375rem 1.25rem 0px rgba(158, 19, 86, 0.30)',
  position: 'absolute',
  bottom: 20,
  width: '20.375rem',
  margin: '0 auto',
  zIndex: 4,
});

export const leftSectionAppNudge = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const titleAppNudge = css({
  fontWeight: 'bold',
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

export const mobileRiveContainer = css({
  width: '100%',
  height: '280px',
  position: 'absolute',
  bottom: 36,
  borderBottomRightRadius: 'inherit',
  borderBottomLeftRadius: 'inherit',
});

export const DWEB_LEFT_BOTTOM_SECTION_BG = css({
  position: 'absolute !important',
  bottom: 0,
  filter: 'blur(50px)',
  backgroundColor: 'rgba(255, 229, 240, 1)',
  left: 0,
  width: '478px',
  height: '105px',
});

export const DWEB_RIGHT_SECTION_BG = css({
  position: 'absolute !important',
  top: 0,
  left: '60%',
  width: '100%',
  height: '100%',
});

export const riveBlendingBG = css({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '90px',
  background:
    'linear-gradient(0deg, #660131 37.51%, rgba(102, 1, 49, 0.00) 100%);',
  zIndex: 2,
  borderBottomLeftRadius: '10px',
  borderBottomRightRadius: '10px',
});
