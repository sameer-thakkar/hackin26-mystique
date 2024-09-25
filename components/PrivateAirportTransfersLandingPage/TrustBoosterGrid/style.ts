import { css } from '@headout/pixie/css';

export const gridStyles = css({
  display: 'grid',
  gap: 'space.24',
  maxWidth: '1200px',
  marginInline: 'auto',
  marginBottom: '4.5rem',
  boxSizing: 'border-box',

  gridTemplateColumns: 'auto 17.625rem 24rem',
  gridTemplateRows: 'auto auto auto',
  gridTemplateAreas: `
    "title     title   title"
    "trustpilot cities customers"
    "trustpilot cities drivers"
  `,

  '@media (max-width: 768px)': {
    gap: 'space.12',

    marginInline: '1rem',
    marginBottom: 0,
    gridTemplateColumns: 'minmax(auto, 10.5rem) auto',
    gridTemplateAreas: `
    "title title"
    "trustpilot trustpilot"
    "cities drivers"
    "cities customers"
  `,
  },
});

export const titleStyles = css({
  textStyle: 'Semantics/Display/Small',
  color: 'core.grey.900',
  marginTop: '0',
  marginBottom: 'space.16',
  letterSpacing: 'ls.4',
  gridArea: 'title',

  '@media (max-width: 768px)': {
    textStyle: 'Semantics/Heading/Large',
    fontFamily: 'font.family.hd',
    fontWeight: 'font.weight.500',
    letterSpacing: 'ls.8',
  },
});
