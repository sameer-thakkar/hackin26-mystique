import { CSSProperties } from 'react';

export const RiveStylesDesktop: CSSProperties = {
  position: 'absolute',
  top: 0,
  zIndex: 2,
  pointerEvents: 'none',
  width: '49.5rem',
  height: '9.375rem',
};

export const RiveStylesMobile: CSSProperties = {
  position: 'absolute',
  top: 0,
  width: '100vw',
  aspectRatio: '1449/960',
  zIndex: 2,
  pointerEvents: 'none',
};

export const RiveStylesHeader: CSSProperties = {
  width: '10rem',
  height: '5.635rem',
  pointerEvents: 'none',
};
