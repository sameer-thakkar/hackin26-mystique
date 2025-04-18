import { css } from '@headout/pixie/css';

export const RiveStylesDesktop = css({
  position: 'absolute',
  zIndex: 0,
  pointerEvents: 'none',
  width: '49.5rem',
  height: '9.375rem',
});

export const RiveStylesMobile = css({
  position: 'absolute',
  width: '100vw',
  aspectRatio: 375 / 250,
  zIndex: 0,
  pointerEvents: 'none',
});

export const RiveStylesHeader = css({
  width: '10rem',
  height: '5.635rem',
  pointerEvents: 'none',
});

export const RiveTopAnchorStyle = css({
  top: 0,
});

export const RiveBottomAnchorStyle = css({
  bottom: 0,
});
