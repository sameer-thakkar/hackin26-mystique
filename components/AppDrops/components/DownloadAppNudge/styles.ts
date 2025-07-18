import { css } from '@headout/pixie/css';

export const leftSectionAppNudge = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.12',
});

export const qrCodeContainer = css({
  height: '172px',
  width: '421px',
  position: 'relative',
});

export const exitIntentQRContainer = css({
  width: '380px !important',
});

export const qrCodeLinksContainer = css({
  backgroundColor: 'white',
  height: '72px',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  borderRadius: '15px',
});

export const qrCodeImage = css({
  position: 'absolute',
  left: '18px',
  bottom: '-5px',
});

export const qrCodeLinks = css({
  display: 'flex',
  flexDirection: 'row',
  gap: '6px',
  position: 'absolute',
  right: '20px',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '6px',
});

export const nudgeButton = css({
  position: 'absolute',
  bottom: '20px',
  right: '30px',
  pointerEvents: 'none',
  height: '36px',
  width: '100px',
});

export const qrCodeImageContainer = css({
  position: 'relative',
});
