import { css } from '@headout/pixie/css';

export const drawerHeaderStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 'space.8',
  paddingBottom: 'space.16',
});

export const drawerBodyStyles = css({
  display: 'grid',
  paddingX: 'space.20',
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto auto',
  columnGap: 'space.16',
  rowGap: 'space.2',
  paddingBottom: 'space.12',
  borderBottom: '1px solid',
  borderColor: 'semantic.dividers.dark',
});

export const headerTextStyles = css({
  textStyle: 'ui.label.small.heavy',
  color: 'semantic.text.grey.3!',
  textTransform: 'uppercase',
});

export const collectionCardsContainerStyles = css({
  overflowY: 'auto',
  paddingBottom: 'space.24',
  maxHeight: '72vh',
});

export const cardContainerStyles = css({
  display: 'block',
  border: '1px solid',
  borderColor: 'semantic.dividers.dark',
  borderRadius: '1rem',
  marginX: 'space.20',
  marginTop: 'space.20',
  marginBottom: 'space.24',

  transition: 'transform 0.15s cubic-bezier(0.7, 0, 0.3, 1)',

  _active: {
    transform: 'scale(0.98)',
  },
});

export const linkToPOISectionStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'repeat(3, auto)',
  gap: 'space.6',
  padding: '1rem',
  borderBottom: '1px solid',
  borderColor: 'semantic.dividers.dark',
});

export const descriptionTextStyles = css({
  gridColumn: 'span 2',
  display: 'flex',
  lineClamp: 2,
  overflow: 'hidden',
  color: 'semantic.text.grey.2!',
  textStyle: 'para.regular',
});

export const priceSectionStyles = css({
  display: 'flex',
  gap: 'space.4',
  marginTop: 'space.6',

  '& span': {
    color: 'semantic.surface.light.white',
  },
});

export const productCardsContainerStyles = css({
  padding: '1rem',
  backgroundColor: 'semantic.surface.light.grey.2',
  display: 'flex',
  gap: 'space.16',
  borderRadius: '0 0 1rem 1rem',
});
export const productInfoCardStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.6',
  flex: '1',
});

export const productImageStyles = css({
  height: 'max-content!',
  borderRadius: '0.5rem',
  aspectRatio: '16 / 10',

  '& img': {
    borderRadius: '0.5rem',
    aspectRatio: '16 / 10',
    width: '100%',
    height: 'auto',
  },
});
