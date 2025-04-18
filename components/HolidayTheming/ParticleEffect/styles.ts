import { css } from '@headout/pixie/css';

export const float = {
  '0%': {
    transform: 'translateY(-1rem) translateX(0) scale(1) rotate(0deg)',
    opacity: 1,
  },

  '80%': {
    opacity: 1,
  },

  '100%': {
    transform: 'translateY(18rem) translateX(10px) scale(2) rotate(20deg)',
    opacity: 0,
  },
};

export const floatHalf = {
  '0%': {
    transform: 'translateY(-1rem) translateX(0) scale(1) rotate(0deg)',
    opacity: 1,
  },
  '100%': {
    transform: 'translateY(8rem) translateX(10px) scale(2) rotate(20deg)',
    opacity: 0,
  },
};

export const floatReverse = {
  '0%': {
    transform: 'translateY(0) translateX(0) scale(1)',
    opacity: 1,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    transform: 'translateY(-8rem) translateX(10px) scale(2)',
    opacity: 0,
  },
};

export const particleStyles = css({
  display: 'inline-block',
  position: 'absolute',
  animation: 'var(--var-animation-name) 4s infinite ease-out',
  color: 'currentColor',
  opacity: 0,
  left: 'var(--var-left)',
  animationDelay: 'var(--var-delay)',
  animationDuration: 'var(--var-duration)',
  pointerEvents: 'none',
});

export const topStyles = css({
  top: 0,
});

export const bottomStyles = css({
  bottom: 0,
});
