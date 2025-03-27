import { css } from '@headout/pixie/css';

export const qrCodeContainer = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
});

export const qrCode = css({
  width: '5.625rem',
  height: '5.625rem',
  overflow: 'hidden',
});

export const divider = css({
  width: '2px',
  height: '7.9375rem',
  border: 'none',
  backgroundImage:
    'linear-gradient(180deg, rgba(255, 0, 122, 0) 0%, rgba(255, 0, 122, 0.5) 47%, rgba(255, 0, 122, 0) 100%)',
});

export const container = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '12px',
  width: '100%',
  maxWidth: '470px',
  background: 'core.primary.white',
  borderRadius: '12px',
  marginTop: '8px',
});

export const leftSectionAppNudge = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});
