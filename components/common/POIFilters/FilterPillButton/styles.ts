import { css } from '@headout/pixie/css';

export const filterPillButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'space.6',
  border: '1px solid',
  borderColor: 'semantic.dividers.dark',
  borderRadius: '1000px',
  paddingX: 'space.12',
  paddingY: 'space.8',
  boxSizing: 'border-box',
  width: 'max-content',
  height: '34px',
  backgroundColor: 'transparent',
  verticalAlign: 'middle',

  '&[data-selected="true"]': {
    backgroundColor: 'semantic.text.grey.2',
    borderColor: 'semantic.text.grey.2',

    '& svg path': {
      stroke: 'core.primary.white',
    },
  },

  '&[data-disabled="true"]': {
    backgroundColor: 'semantic.surface.light.grey.2',
    cursor: 'default',
    borderColor: 'semantic.dividers.primary',

    '& svg path': {
      stroke: 'semantic.text.disabled',
    },
  },

  transition: 'transform 0.15s cubic-bezier(0.7, 0, 0.3, 1)',
  _active: {
    transform: 'scale(0.95)',

    '&[data-disabled="true"]': {
      transform: 'unset',
    },
  },

  '& svg': {
    width: '0.75rem',
    height: '0.75rem',
  },

  '@media (min-width: 768px)': {
    _hover: {
      borderColor: 'semantic.text.grey.2',
      cursor: 'pointer',

      '&[data-disabled="true"]': {
        borderColor: 'semantic.dividers.dark',
        cursor: 'default',
      },
    },

    height: '42px',
    '& svg': {
      width: '1rem',
      height: '1rem',
    },
  },
});

export const filterTextStyle = css({
  textStyle: 'ui.label.regular.heavy',
  transform: 'translateY(-0.5px)',

  '@media (min-width: 768px)': {
    textStyle: 'subheading.large',
  },
});
