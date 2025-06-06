import { css } from '@headout/pixie/css';

export const cancellationLayoutStyle = css({
  display: 'flex',
  flexDirection: 'column',
  paddingX: 'space.16',
  paddingY: 'space.20',
  width: '100%',
  maxWidth: '792px',
  height: '100%',
  maxHeight: '80svh',
  gap: 'space.12',
  position: 'relative',
  boxSizing: 'border-box',

  '@media (min-width: 768px)': {
    gap: 'space.8',
    padding: 'space.24',

    '& img': {
      marginBottom: 'space.4',
    },

    '& .cross': {
      position: 'absolute',
      top: 'space.24',
      right: 'space.24',
      cursor: 'pointer',
      width: '0.656rem',
      height: '0.656rem',
    },
  },
});

export const boostersContainerStyles = css({
  display: 'flex',
  gap: 'space.12',
  alignItems: 'center',

  '& > span': {
    display: 'flex',
    gap: 'space.2',
    alignItems: 'center',
  },

  '@media (min-width: 768px)': {
    paddingBottom: 'space.20',
    borderBottom: '1px solid #e2e2e2',
  },
});

export const boosterStyle = css({
  textStyle: 'subheading.small',
  color: 'semantic.surface.dark.success.2',
});

export const cancellationInfoListStyles = css({
  paddingLeft: '2rem',
  paddingRight: '0.5rem',
  paddingBottom: '2rem',
  marginTop: '-space.4',
  marginBottom: '4rem',
  overflowY: 'auto',

  '& li': {
    listStyleType: 'square',
    textStyle: 'para.regular',

    _marker: {
      fontSize: '0.75rem',
    },
  },

  '@media (min-width: 768px)': {
    paddingRight: 'unset',
    paddingBottom: 'unset',
    marginTop: 'space.8',
    marginBottom: 'unset',

    '& li': {
      textStyle: 'para.medium',
    },
  },
});

export const buttonContainerStyles = css({
  padding: 'space.16',
  boxShadow: 'shadow.top.1',
  backgroundColor: 'semantic.surface.light.white',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,

  '@media (min-width: 768px)': {
    display: 'none',
  },
});
