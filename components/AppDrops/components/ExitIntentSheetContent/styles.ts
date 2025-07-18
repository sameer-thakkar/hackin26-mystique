import { css } from '@headout/pixie/css';

export const exitIntentBottomSheetContent = css({
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  borderTopRadius: '20px',
  overflow: 'hidden',
  backgroundImage: `url(https://cdn-imgix.headout.com/assets/images/drops/Exit+intent+background.png)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
});

export const exitIntentRiveContainer = css({
  height: '175px',
  width: '100%',
  marginBottom: 'space.24',
  scale: '1.15',
  '@media (min-width: 390px)': {
    scale: '1.2',
    marginBottom: '28px',
  },
});

export const exitIntentButtonContainer = css({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '16px',
  gap: '8px',
});

export const exitIntentHeadingMargin = css({
  marginTop: 'space.8',
  marginBottom: 'space.4',
  textAlign: 'center !important',
  maxWidth: '300px',
  background:
    'radial-gradient(73.99% 312.07% at 13.01% 29.26%, #660031 0%, #CC0062 100%)',
  WebkitTextFillColor: 'transparent',
  // @ts-ignore
  WebkitBackgroundClip: 'text',
  '@media (max-width: 767px)': {
    maxWidth: '500px',
  },
});

export const exitIntentDescriptionMargin = css({
  marginBottom: 'space.10',
  textAlign: 'center !important',
  maxWidth: '300px',
  '@media (min-width: 390px)': {
    marginBottom: 'space.24',
  },
  '@media (max-width: 767px)': {
    maxWidth: '500px',
  },
});
