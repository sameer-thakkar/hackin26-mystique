import { css } from '@headout/pixie/css';

export const trustpilotWidgetContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  position: 'absolute',
  left: '0',
  zIndex: 2,
  width: '100%',
  bottom: '0',
  height: '100%',
  padding: '0 0 10px 10px',
  background:
    'linear-gradient(221deg, rgba(1, 1, 1, 0.00) 42.2%, #010101 77.79%)',

  '@media only screen and (min-width: 768px)': {
    padding: '0 0 20px 20px',
  },
});

export const trustpilotWidgetContentStyles = css({
  height: '80px',
  width: '112px',

  '@media only screen and (min-width: 768px)': {
    height: '112px',
    width: '250px',
  },
});
