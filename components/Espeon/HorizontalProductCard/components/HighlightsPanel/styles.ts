import { css } from '@headout/pixie/css';

export const highlightsPanelStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.4',
});

export const detailsCta = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'space.4',
  width: 'max-content',

  '&[data-enabled=true]': {
    cursor: 'pointer',
  },
  '& svg': {
    marginTop: 'space.2',
  },
  '& span': {
    borderBottom: 'solid 1px token(colors.semantic.text.grey.2)',
  },
});
