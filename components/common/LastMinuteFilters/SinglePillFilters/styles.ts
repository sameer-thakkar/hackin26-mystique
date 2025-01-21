import { css } from '@headout/pixie/css';

export const filterButtonStyle = css({
  borderRadius: '1000px',
  borderColor: 'semantic.text.grey.2',
  backgroundColor: 'semantic.text.grey.2',
  color: 'white',
  paddingX: 'space.12',
  paddingY: 'space.8',
  boxSizing: 'border-box',

  display: 'flex',
  alignItems: 'center',
  gap: 'space.6',

  height: '34px',
  width: 'max-content',

  transition: 'transform 0.15s cubic-bezier(0.7, 0, 0.3, 1)',
  _active: {
    transform: 'scale(0.95)',
  },

  '@media (min-width: 768px)': {
    height: '42px',
  },
});
export const chevronIconStyle = css({
  width: '12px',
  height: '12px',
  transform: 'translateY(2px)',
  '& path': {
    stroke: 'white',
  },
});
export const drawerHeaderStyle = css({
  boxSizing: 'border-box',
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingX: 'space.16',
  paddingY: 'space.12',
  borderBottom: '1px solid',
  borderColor: 'semantic.surface.light.grey.3',
  marginTop: 'space.12',
});
export const panelAnchorStyle = css({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  marginBottom: '1rem',
  width: '54px!',
  marginTop: '0.5rem',
  top: '0',
});
export const iconWrapperStyle = css({
  padding: 'space.6',
  backgroundColor: 'semantic.surface.light.grey.3',
  borderRadius: '6px',
  maxHeight: '24px',
  display: 'flex',
  alignItems: 'center',
});
export const filterOptionStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginX: 'space.24',
  paddingY: 'space.20',
  '&:not(:last-child)': {
    borderBottom: '1px solid',
    borderColor: 'semantic.surface.light.grey.3',
  },

  '&[data-is-available="false"]': {
    '& .option-text': {
      color: 'semantic.text.disabled!',
    },

    '& .radio': {
      fill: 'core.grey.200',

      '& circle:last-child': {
        display: 'none',
      },
    },
  },
});
