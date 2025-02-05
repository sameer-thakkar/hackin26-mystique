import { css } from '@headout/pixie/css';

export const discountTagTransformStyle = css({
  transform: 'rotate(180deg)',
});

export const discountTagContainer = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  height: 'max-content',
  alignItems: 'center',
  alignSelf: 'center',
});

export const discountTextContainer = css({
  backgroundColor: 'semantic.surface.dark.success.1',
  borderTopRightRadius: '0.25rem',
  borderRightRadius: '0.25rem',
  height: '20px',
  margin: 0,
  paddingRight: '0.3125rem',
  overflow: 'hidden',
  transform: 'translateX(-0.0625rem)',

  '&[data-show-angled-tag=false]': {
    borderRadius: '0.25rem',
    padding: '0 0.3125rem',
  },

  '&[data-point-left=false]': {
    paddingLeft: '0.3125rem',
    paddingRight: ' 0',
    borderTopLeftRadius: '0.25rem',
    borderBottomLeftRadius: '0.25rem',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    transform: 'none',
  },
});

export const discountTextStyle = css({
  transform: 'translateY(0.5px)',

  '@media only screen and (min-width: 768px)': {
    marginTop: 'space.2',
  },
  '@media only screen and (min-width: 1280px)': {
    marginTop: 'space.1',
  },
});
