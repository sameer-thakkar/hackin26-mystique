import { css } from '@headout/pixie/css';

export const filterContainerStyles = css({
  display: 'flex',
  height: '[38px]',
  gap: 'space.12',
  marginTop: 'space.16',
  overflowX: 'auto',

  '@media (max-width: 768px)': {
    width: '[100%]',
    // The reviews filter in mobile is taking 1px extra width, so we need to subtract it to remove it.
    maxWidth: 'calc(100% - 4px)',
    marginLeft: '-space.24',
    padding: '1px 24px',
    height: '[52px]',
  },
});
