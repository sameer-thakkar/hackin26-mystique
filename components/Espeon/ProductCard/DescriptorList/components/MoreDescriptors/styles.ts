import { css } from '@headout/pixie/css';

export const extraDescriptorsContainer = css({
  display: 'flex',
  gap: 'space.6',
  alignItems: 'center',
  cursor: 'pointer',

  // @TODO: text component fix awaiting.
  textStyle: 'Semantics/UI Label/Medium',
  color: 'semantic.text.grey.2',

  '& svg': {
    mt: 'space.2',
  },
  '& span': {
    borderBottom: 'solid 1px token(colors.semantic.text.grey.2)',
    borderStyle: 'dashed',
  },
});
