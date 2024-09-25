import { css, cva } from '@headout/pixie/css';

export const containerStyle = css({
  background: 'rgb(21, 0, 41)',
  minHeight: '22.5rem',
});

export const gridContainerStyle = css({
  maxWidth: '75rem',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',

  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    paddingBlock: '0',
  },
});

export const leftColumnStyle = css({
  width: '491px',
  maxWidth: '100%',
  zIndex: '3',
  marginTop: '-1.7rem',
  '@media (max-width: 768px)': {
    order: 2,
    paddingInline: '1rem',
    width: 'auto',
    marginTop: '-4.75rem',
  },
});

export const headingStyle = css({
  textStyle: 'Semantics/Display/Medium',
  color: 'semantic.cta.white',
  marginTop: '0',
  marginBottom: '0',
  display: 'inline-block',
  '@media (max-width: 768px)': {
    fontSize: '1.5rem',
    fontWeight: '500',
    marginBottom: '0.375rem',
    lineHeight: 'lh.28',
  },
  _after: {
    content: '""',
    display: 'flex',
    height: '2px',
    width: 'calc(100% + 1rem)',
    marginTop: '1rem',
    background:
      'linear-gradient(270deg, rgba(226, 226, 226, 0) -1.28%, rgb(102, 102, 102) 102.98%)',

    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});

export const subtextStyle = css({
  textStyle: 'Semantics/Para/Large',
  color: 'semantic.cta.white',
  marginTop: '0.725rem',
  '@media (max-width: 768px)': {
    textStyle: 'Semantics/Para/Small',
    marginBlock: '0',
  },
});

export const rightColumnStyle = css({
  position: 'relative',
  right: '3rem',
  '@media (max-width: 768px)': {
    right: '0',
    order: 1,

    '& img': {
      width: '100%',
      height: 'auto',
    },
  },
});

export const inputsWrapperStyle = css({
  gridColumn: 'span 2',
  position: 'absolute !important',
  bottom: '-3.125rem',
  zIndex: '3',

  '@media (max-width: 768px)': {
    gridColumn: 'span 1',
    position: 'relative !important',
    order: 3,
    bottom: 'unset',
    margin: '1rem',
  },
});

export const gradientStyles = cva({
  base: {
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  variants: {
    position: {
      top: {
        top: 0,
        height: '7.125rem',
        background:
          'linear-gradient(180deg, #15002A -1.07%, rgba(21, 3, 40, 0) 100%)',
      },
      left: {
        left: 0,
        height: '100%',
        width: '20rem',
        background:
          'linear-gradient(to right, #15002A 10.07%, rgba(21, 3, 40, 0) 100%)',
      },
      right: {
        right: 0,
        height: '100%',
        width: '7.5rem',
        background:
          'linear-gradient(to left, #15002A 5%, rgba(21, 3, 40, 0) 45%)',
      },
      bottom: {
        bottom: 0,
        height: '7.5rem',
        background:
          'linear-gradient(0deg, #15002A 0%, rgba(21, 3, 40, 0) 100%)',
        '@media (max-width: 768px)': {
          background:
            'linear-gradient(0deg, #150029 33.02%, rgba(21, 3, 40, 0.00) 99.67%)',
        },
      },
    },
  },
});
