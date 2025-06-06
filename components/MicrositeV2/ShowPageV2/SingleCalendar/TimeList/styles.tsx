import { css } from '@headout/pixie/css';

const skeletonStyles = css({
  maxWidth: '22rem',
  margin: 'space.16',
  marginTop: '0',
  marginBottom: 'space.8',
});

const skeletonContainer = css({
  lineHeight: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const timeSlotStyles = css({
  padding: 'space.12',
  paddingBottom: '0.6875rem',
  height: '3.875rem',
  maxWidth: '22rem',
  border: '1px solid',
  borderColor: 'core.grey.300',
  borderRadius: 'radius.8',
  margin: 'space.16',
  marginTop: '0',
  marginBottom: 'space.12',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxHeight: '2.5rem',
  cursor: 'pointer',
  transition:
    'background 0.2s cubic-bezier(0.7, 0, 0.3, 1), transform 0.2s cubic-bezier(0.7, 0, 0.3, 1), border-color 0.2s cubic-bezier(0.7, 0, 0.3, 1)',

  '&[aria-selected="true"]': {
    borderColor: 'core.purps.100',
    paddingBottom: '0.625rem',
    border: '1px solid',
    borderBottomWidth: '2px',
    background: 'core.purps.10',

    _hover: {
      background: 'core.purps.20',
    },

    _active: {
      background: 'core.purps.30',
    },
  },
  '&:hover': {
    background: 'core.grey.100',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
});

const timeSlotTextStyles = css({
  textStyle: 'ui.label.regular.heavy',
  color: 'core.grey.900',
  marginBottom: 'space.4',
});

const timeSlotBoostStyles = css({
  textStyle: 'ui.label.small',
  color: 'core.grey.700',
});

const listingPriceStyles = css({
  textStyle: 'ui.label.regular.heavy',
  color: 'core.grey.900',
  marginBottom: 'space.2',
  display: 'flex',
  alignItems: 'center',
  gap: 'space.2',
});

const listingPriceStrikeStyles = css({
  textStyle: 'ui.label.strike.extraSmall',
  color: 'core.grey.700',
  alignSelf: 'center',
  verticalAlign: 'middle',
});

const discountTagStyles = css({
  textStyle: 'ui.label.small',
  color: 'core.grey.700',
});

export {
  discountTagStyles,
  listingPriceStrikeStyles,
  listingPriceStyles,
  skeletonContainer,
  skeletonStyles,
  timeSlotBoostStyles,
  timeSlotStyles,
  timeSlotTextStyles,
};
