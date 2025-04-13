import { css } from '@headout/pixie/css';

export const dialogPopupContainer = css({
  borderRadius: '24px',
  maxWidth: '762px',
  maxHeight: '414px',
  padding: '0',
  width: '100%',
  position: 'relative',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  background: 'core.primary.white',
  overflow: 'hidden',
});

export const dialogPopupVisible = css({
  transform: 'translateY(0)',
  opacity: 1,
});

export const dialogPopupHidden = css({
  transform: 'translateY(20px)',
  opacity: 0,
});

export const dialogCloseButton = css({
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
});

export const dialogPopupContent = css({
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 24px 0',
});

export const dialogFlexContainer = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '24px',
});

export const dialogGradientTopSection = css({
  background: 'linear-gradient(103.58deg, #FFEEE4 29.82%, #FFE8F6 98.11%)',
  position: 'relative',
  borderRadius: '24px 24px 0 0',
  marginBottom: '-2px',
});

export const dialogCurvedBottomSection = css({
  position: 'relative',
  width: '100%',
  height: '1.5rem',
  marginTop: '16px',
  left: 0,
  right: 0,
});

export const dialogCurvedSvgContainer = css({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '2.25rem',
  overflow: 'hidden',
});

export const dialogDiscountTag = css({
  top: '-6px',
  left: '32px',
  display: 'flex',
  height: '1.875rem',
  gap: '8px',
  maxWidth: 'fit-content',
  alignItems: 'center',
  padding: '6px 8px',
  borderRadius: '8px',
  background: 'linear-gradient(180deg, #cc0062 0%, #660031 100%)',
  color: 'core.primary.white',
});

export const dialogLogo = css({
  width: '6.25rem',
  height: '1.875rem',
  objectFit: 'contain',
});

export const dialogStepsContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginTop: '12px',
  marginBottom: '24px',
});

export const dialogStepItem = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const dialogIconContainer = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.25rem',
  height: '1.25rem',
});

export const dialogQrCodeContainer = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
});

export const dialogQrCode = css({
  width: '5.625rem',
  height: '5.625rem',
  overflow: 'hidden',
});

export const dialogFlexDisplay = css({
  display: 'flex',
  alignItems: 'center',
});

export const dialogDiscountTagPadding = css({
  paddingBottom: '4px',
});

export const dialogRiveContainer = css({
  height: '13.375rem',
  width: '19.75rem',
  scale: '1.2',
  alignSelf: 'flex-end',
  marginBottom: '-32px',
});

export const textTitleStyle = css({
  marginTop: '12px',
});
