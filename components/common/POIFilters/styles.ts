import { css } from '@headout/pixie/css';

export const poiFiltersWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '3px',
  maxWidth: '100%',
  overflowX: 'auto',

  scrollbarWidth: 'none',
  _scrollbar: {
    display: 'none',
  },
  boxSizing: 'border-box',
  height: '100%',

  position: 'sticky',
  top: '56px', // 56px is the height of the header
  background: 'white',
  zIndex: 10,
  paddingTop: '5px',
  paddingBottom: '1px',

  '&.sticky': {
    borderBottom: '1px solid',
    borderBottomColor: 'semantic.dividers.dark',
  },

  '@media (min-width: 768px)': {
    '@media (min-width: 768px)': {
      maxWidth: '75rem',
      marginX: 'auto',
      marginTop: '2.25rem',
      marginBottom: '-12px',

      position: 'static',

      '&.sticky': {
        borderBottom: 'none',
      },
    },
  },
});

export const filtersContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'space.8',
  paddingRight: 'space.24',
  transform: 'translateZ(0px)', // ios weird bug when using sticky position  fix - svgs shake on body scroll

  '@media (min-width: 768px)': {
    gap: 'space.12',
  },
});

export const separatorStyle = css({
  width: '1px',
  backgroundColor: 'semantic.dividers.dark',
  marginLeft: 'space.12',
  marginRight: 'space.4',
  alignSelf: 'stretch',

  '@media (min-width: 768px)': {
    display: 'none',
  },
});
