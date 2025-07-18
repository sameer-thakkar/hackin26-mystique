import { css } from '@headout/pixie/css';

export const bannerContainer = css({
  maxWidth: '75rem',
  margin: '0 1.5rem',
  borderRadius: '16px',
  position: 'relative',
  minHeight: '22.6875rem',
  border: '1px solid rgba(252, 230, 234, 1)',
  backgroundImage: `url(https://cdn-imgix.headout.com/assets/images/drops/ho-mweb-banner-bg.png)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',

  '@media (min-width: 390px)': {
    minHeight: '23.25rem',
  },

  '@media (min-width: 768px)': {
    width: '100%',
    background:
      'radial-gradient(97.12% 293.35% at 0% 7.31%, #FFF7D9 0%, #FFFFFF 100%)',
    margin: '0 auto',
    minHeight: '13.125rem',
    overflow: 'hidden',
  },
});

export const bannerContainerNoMargin = css({
  margin: '0 !important',
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
  padding: '0.8rem',

  '@media (min-width: 768px)': {
    flexDirection: 'row',
    padding: '0px',
  },
});

export const leftSection = css({
  flex: '1',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  maxWidth: '42.5rem',
  marginTop: 0,
  zIndex: 2,

  '@media (min-width: 768px)': {
    alignItems: 'flex-start',
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
  margin: '0.5rem 0 0.125rem 0 !important',
  textAlign: 'left !important',
  lineHeight: '32px',
  '@media (max-width: 768px)': {
    textAlign: 'center !important',
    background:
      'radial-gradient(73.99% 312.07% at 13.01% 29.26%, #660031 0%, #CC0062 100%)',
    WebkitTextFillColor: 'transparent',
    // @ts-ignore
    WebkitBackgroundClip: 'text',
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
  width: '90%',
  margin: '8px auto 0 auto',
});

export const ctaButtonContainer = css({
  position: 'absolute',
  width: '100%',
  bottom: 12,
  zIndex: 4,
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
  height: '170px',
  marginBottom: 'space.16',
  '@media (min-width: 390px)': {
    marginBottom: '24px',
    scale: '1.09',
  },
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
  width: '604px !important',
  height: '366px !important',
});
