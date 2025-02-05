import { css } from '@headout/pixie/css';

export const productLabelStyles = css({
  display: 'flex',
  alignItems: 'center',
  columnGap: 'space.8',
  width: '[100%]',
});

export const separatorStyle = css({
  position: 'relative',
  height: '0.25rem',
  width: '0.25rem',
  top: '0.078rem',
  backgroundColor: 'semantic.dividers.dark',
  rounded: 'radius.50p',
});

export const infoButtonStyle = css({
  display: 'flex',
  marginLeft: 'auto',
  backgroundColor: 'transparent',
  backgroundImage: 'none',
  border: 'none',
  color: '#444',
});
