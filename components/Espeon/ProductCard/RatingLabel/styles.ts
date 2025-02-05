import { css } from '@headout/pixie/css';

// @TODO: convert to sva
export const ratingIconStyle = css({
  height: '12px',
  width: '12px',
  marginTop: '1px',
});

export const ratingLabelWrapperClass = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'space.4',
  color: 'semantic.text.candy',
});

export const averageRatingClass = css({
  '@media only screen and (max-width: 768px)': {
    textStyle: 'Semantics/UI Label/Regular (Heavy)',
    marginTop: 'space.1',
  },
});

export const ratingsNewLabelClass = css({
  // @TODO: text component fix awaiting.
  textTransform: 'uppercase',
});

export const ratingCountClass = css({
  // @TODO: text component fix awaiting.
  textStyle: 'Semantics/UI Label/Medium',
  // @TODO: will get this token added in Pixie.
  letterSpacing: '0',
  textAlign: 'left',
  '&[data-enabled=true] > span': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },

  '@media only screen and (max-width: 768px)': {
    textStyle: 'Semantics/UI Label/Regular',
  },
});
