import { css } from '@headout/pixie/css';

export const timerContainer = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const timeUnit = css({
  display: 'inline-flex',
  alignItems: 'center',
});

export const digitContainer = css({
  position: 'relative',
  width: '0.6em',
  height: '1em',
  overflow: 'hidden',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const digit = css({
  animation: 'slideInFromTop 0.3s ease-out',
  animationFillMode: 'both',
});

export const separator = css({
  margin: '0 2px',
});
