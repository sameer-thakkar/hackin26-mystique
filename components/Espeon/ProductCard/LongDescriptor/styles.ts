import { css } from '@headout/pixie/css';

export const longDescriptor = css({
  display: 'flex',
  gap: 'space.8',
});

export const descriptorIcon = css({
  h: '36px',
  w: '36px',
  flexShrink: 0,
  rounded: 'radius.6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const descriptorInfoStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.4',
});
