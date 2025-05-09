import { css } from '@headout/pixie/css';

export const styles = {
  pageWrapper: css({
    my: 'space.48',
    mx: 'auto',
    px: 'space.16',
    maxWidth: '77rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 'space.24',
    color: 'semantic.text.black.translucent',

    '@media (max-width: 768px)': {
      my: 'space.24',
    },
  }),
  pageTitle: css({
    textStyle: 'Semantics/Display/Regular',

    '@media (max-width: 768px)': {
      textStyle: 'Semantics/Display/XS',
    },
  }),
  section: css({
    p: 'space.32',
    border: '1px solid',
    borderColor: 'semantic.dividers.dark',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 'space.16',

    '@media (max-width: 768px)': {
      p: 'space.20',
      borderRadius: 12,
    },
  }),
  sectionTitle: css({
    textStyle: 'Semantics/Heading/Large',
    color: 'semantic.text.grey.1',

    '@media (max-width: 768px)': {
      textStyle: 'Semantics/Heading/Medium',
    },
  }),
  content: css({
    textStyle: 'Semantics/Para/Large',

    '@media (max-width: 768px)': {
      textStyle: 'Semantics/Para/Medium',
    },
  }),
  odrLinkText: css({
    textStyle: 'Semantics/Subheading/Large',
  }),
  contentListWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 'space.20',

    '@media (max-width: 768px)': {
      gap: 'space.24',
    },
  }),
  contentListItem: css({
    display: 'flex',
    gap: 'space.8',

    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: 'space.0',
    },
  }),
  contentListItemKey: css({
    width: '16rem',
    flexShrink: 0,
    textStyle: 'Semantics/Subheading/Large',
    color: 'semantic.text.grey.2',

    '@media (max-width: 768px)': {
      width: 'fit-content',
    },
  }),
  contentListItemValue: css({
    textStyle: 'Semantics/UI Label/Large',
  }),
};
