import { css } from '@headout/pixie/css';

export const featureContainerStyle = css({
  width: '100%',
  overflow: 'visible',
  '@media (max-width: 768px)': {
    maxWidth: '14rem',
    scrollSnapAlign: 'start',
    flexShrink: 0,
  },
});

export const iconContainerStyle = css({
  position: 'relative',
  '@media (max-width: 768px)': {
    '& svg': {
      width: '2rem',
      height: '2rem',
    },
  },
});

export const titleStyle = css({
  textStyle: 'Semantics/Heading/Medium',
  fontFamily: 'font.family.hd',
  letterSpacing: 'ls.8',
  fontWeight: 'font.weight.500',
  color: 'core.grey.800',
  margin: '0',
  marginTop: '0.75rem',
  marginBottom: '0.25rem',
  '@media (max-width: 768px)': {
    fontFamily: 'font.family.ht',
    marginTop: '0.5rem',
    marginBottom: 0,
    letterSpacing: 'initial',
    textStyle: 'Semantics/Subheading/Large',
  },
});

export const descriptionStyle = css({
  textStyle: 'Semantics/Para/Medium',
  color: `core.grey.700`,
  margin: '0',
  '@media (max-width: 768px)': {
    textStyle: 'Semantics/Para/Regular',
    marginTop: '0.25rem',
  },
});

export const featureSectionContainerStyle = css({
  maxWidth: '75rem',
  margin: '7.75rem auto 4.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 'space.24',

  '@media (max-width: 768px)': {
    overflow: 'auto',
    margin: '0 auto',
    paddingBlock: '1.5rem',
    paddingInline: '1rem',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
    scrollSnapType: 'x mandatory',
    scrollPadding: '0 1rem',
  },
});

export const featureStyle = css({
  position: 'relative',
});

export const gradientCircleTopStyle = css({
  top: '11px',
  left: '2rem',
});

export const gradientCircleBottomStyle = css({
  top: '43px',
  left: '-12px',
});

export const COLOR_CLASSNAME_LIST = [
  css({
    backgroundColor: 'core.dreamypale.500',
  }),
  css({
    backgroundColor: 'core.oceanblue.500',
  }),
  css({
    backgroundColor: 'core.primary.purps',
  }),
  css({
    backgroundColor: 'core.okaygreen.600',
  }),
];
