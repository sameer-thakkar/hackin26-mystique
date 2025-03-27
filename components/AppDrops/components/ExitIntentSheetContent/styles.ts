import { css } from '@headout/pixie/css';

export const exitIntentBottomSheetContent = css({
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  background: 'core.primary.white',
  borderTopRadius: '20px',
});

export const exitIntentDiscountTag = css({
  position: 'relative',
  zIndex: '1',
  display: 'flex',
  height: '1.625rem',
  gap: '8px',
  maxWidth: 'fit-content',
  minWidth: '206px',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: '0 0 16px 16px',
  background: 'linear-gradient(180deg, #CC0062 0%, #660031 100%)',
  color: 'core.primary.white',

  '@media (min-width: 768px)': {
    height: '1.875rem',
  },
});

export const exitIntentDiscountTagWrapper = css({
  position: 'absolute',
  top: '-6px',
  left: '50%',
  transform: 'translateX(-50%)',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '-6px',
    width: '0',
    height: '0',
    borderTop: '6px solid transparent',
    borderRight: '6px solid #6B0134',
    borderBottom: '0',
    borderLeft: '0',
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    top: '0',
    right: '-6px',
    width: '0',
    height: '0',
    borderTop: '6px solid transparent',
    borderRight: '0',
    borderBottom: '0',
    borderLeft: '6px solid #6B0134',
  },
});

export const exitIntentLogo = css({
  width: '5rem',
  height: '1.625rem',
  objectFit: 'contain',
});

export const exitIntentStepsContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginTop: '12px',
  marginBottom: '24px',
});

export const exitIntentStepItem = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const exitIntentIconContainer = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.25rem',
  height: '1.25rem',
});

export const exitIntentAnimationContainer = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '10.25rem',
  borderRadius: '18px',
  margin: '30px auto 22px auto',
  background: 'linear-gradient(103.58deg, #FFEEE4 29.82%, #FFE8F6 98.11%)',
});

export const exitIntentRiveContainer = css({
  scale: '1.15',
  marginBottom: '24px',
  height: '10.25rem',
  width: '21.375rem',
});

export const exitIntentButtonContainer = css({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '16px',
  gap: '8px',
});

export const exitIntentDiscountTagPadding = css({
  paddingBottom: '4px',
});

export const exitIntentHeadingMargin = css({
  marginBottom: '4px',
});

export const exitIntentDescriptionMargin = css({
  marginBottom: '16px',
});

export const exitIntentStepsMarginTop = css({
  marginTop: 8,
});

export const exitIntentButton = css({
  height: '2.25rem',
});
