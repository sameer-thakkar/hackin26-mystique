import { css } from '@headout/pixie/css';

export const filterContainerStyles = css({
  display: 'flex',
  height: '[36px]',
  gap: 'space.12',
  marginTop: 'space.16',
  overflowX: 'auto',

  '@media (max-width: 768px)': {
    width: '[100%]',
    marginLeft: '-space.24',
    padding: '1px 24px',
    height: '[52px]',
  },
});
