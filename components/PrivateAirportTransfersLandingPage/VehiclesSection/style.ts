import { css } from '@headout/pixie/css';

export const containerStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  gridAutoFlow: 'column',
  gap: 'space.24',
  maxWidth: '75rem',
  marginBlock: '4.5rem',
  marginInline: 'auto',

  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gridAutoFlow: 'row',
    gap: 'space.16',
    marginTop: '2.62rem',
    marginBottom: '0.745rem',
  },
});

export const leftColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  '&  svg path': {
    stroke: 'white',
  },

  '@media (max-width: 768px)': {
    margin: '0 1rem',
  },
});

export const headingStyle = css({
  textStyle: 'display.small',
  marginBottom: 'space.8',
  color: 'core.grey.900',
  margin: '0',
  letterSpacing: 'ls.4',

  '@media (max-width: 768px)': {
    textStyle: 'heading.large',
    fontFamily: 'font.family.hd',
    fontWeight: 'font.weight.500',
    letterSpacing: 'ls.8',
  },
});

export const paragraphStyle = css({
  textStyle: 'para.medium',
  color: 'core.grey.800',
  margin: '0',

  '@media (max-width: 768px)': {
    textStyle: 'para.regular',
    marginBottom: 'space.8',
  },
});

export const fromTextStyle = css({
  marginTop: 'auto',
  textStyle: 'ui.label.regular',
  marginBottom: 'space.2',
});

export const priceStyle = css({
  textStyle: 'display.small',
  color: 'core.grey.800',
  marginBottom: 'space.8',
});

export const sliderContainerStyle = css({
  maxWidth: '100%',
  overflow: 'hidden',
  paddingInline: '1.25rem',
  marginInline: '-1.25rem',

  '& .next-slide': {
    right: '-19px !important',
  },
  '& .prev-slide': {
    left: '-19px !important',
  },

  '@media (max-width: 768px)': {
    padding: '0',
    margin: '0',

    '& .swiper': {
      paddingInline: '1rem !important',
    },
  },
});
export const cardStyles = css({
  width: '279px',
  height: '316px',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',

  '@media (max-width: 768px)': {
    width: '100%',
    height: 'auto',
    aspectRatio: '223 / 251',
  },
});
export const imageStyles = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute !important',
  zIndex: '0',
  top: '0',
  left: '0',
  bottom: '0',

  '& img': {
    height: '80%!',
  },
});
export const contentStyles = css({
  marginTop: 'auto',
  padding: '2.5rem 1rem 1rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  zIndex: '1',
  background:
    'linear-gradient(180deg, rgba(1, 20, 64, 0.00) 0%, #000D2B 53.54%)',

  '@media (max-width: 768px)': {
    padding: '0.75rem',
    paddingTop: '2rem',
  },
});
export const titleStyles = css({
  fontWeight: '500',
  color: 'core.primary.white',
  margin: '0',
  fontFamily: 'font.family.hd',
  fontSize: 'font.size.21',
  letterSpacing: 'ls.8',
  lineHeight: 'lh.28',

  '@media (max-width: 768px)': {
    fontSize: 'font.size.18',
    letterSpacing: '0.6px',
    lineHeight: 'lh.24',
  },
});

export const detailsStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'space.8',
});

export const separatorStyles = css({
  width: '4px',
  height: '4px',
  borderRadius: '50%',
  background: '#C4C4C4',
  marginTop: 'space.2',
});

export const detailItemStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: 'space.6',
  textStyle: 'ui.label.regular',
  color: 'core.grey.300',

  '@media (max-width: 768px)': {
    textStyle: 'ui.label.small',
  },
});

export const carListStyles = css({
  textStyle: 'para.regular',
  color: 'core.grey.200',
  margin: '0',
  marginTop: 'space.4',

  '@media (max-width: 768px)': {
    textStyle: 'para.small',
  },
});
