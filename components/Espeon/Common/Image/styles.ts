import { css } from '@headout/pixie/css';

export const imageWrapper = css({
  position: 'relative',
  height: '100%',
  width: '100%',
  '& img': {
    objectFit: 'cover',
  },
  '& > span': {
    position: 'static !important',
  },
});
