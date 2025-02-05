import { css, cva } from '@headout/pixie/css';

export const descriptorListStyles = cva({
  base: {
    display: 'flex',
    position: 'relative',
  },
  variants: {
    layout: {
      row: {
        flexDirection: 'row',
        gap: 'space.14',

        '@media only screen and (max-width: 768px)': {
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: 'space.6',
          rowGap: 'space.4',
        },
      },
      column: {
        flexDirection: 'column',
        gap: 'space.10',
      },
    },
    icons: {
      false: {
        gap: 'space.6',

        '@media only screen and (max-width: 768px)': {
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: 'space.6',
          rowGap: 'space.6',
        },
      },
    },
  },
});

export const descriptorsCardContainer = css({
  zIndex: 2,
  maxW: '22.5rem',
  mt: 'space.6',
  position: 'absolute',
  bg: 'semantic.surface.light.white',
  boxShadow: `0px 1px 6px 1px #1111111A, 0px 1px 4px 0px #1111110D`,
  padding: 'space.12',
  rounded: 'radius.12',
});

export const extraDescriptorsCard = css({
  display: 'flex',
  gap: 'space.6',
  flexWrap: 'wrap',
  alignItems: 'center',
  textStyle: 'Semantics/UI Label/Medium',
  color: 'semantic.text.grey.2',
  '& svg': {
    mt: 'space.2',
  },
});

export const descriptorSpacer = css({
  mt: 'space.2',
  width: '4px',
  height: '4px',
  backgroundColor: 'semantic.dividers.dark',
  rounded: 'radius.50p',
});
