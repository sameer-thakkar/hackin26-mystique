import { css } from '@headout/pixie/css';

export const contentContainer = css({
  maxWidth: '1200px',
  margin: '36px auto 10px',
  color: 'misc.brilliantLiqourice',

  '& > div': {
    fontFamily: 'var(--font-halyard-text)',
    lineHeight: 1.5,
  },

  '@media (max-width: 768px)': {
    margin: '20px 16px 10px',
  },
});

export const heading = css({
  textStyle: 'heading.large',
  marginBottom: 'space.16',
});

export const lastUpdated = css({
  fontSize: '0.9375rem',
  margin: '18px 0',
  '@media (max-width: 768px)': {
    fontSize: '0.875rem',
    margin: '10px 0',
  },
});

export const termsList = css({
  marginLeft: '10px',
  paddingLeft: '15px',
  listStyleType: 'none',
  counterReset: 'item',

  '& > a': {
    color: 'text.beach',
  },

  '& > li': {
    display: 'table',
    fontWeight: 'bold',
    marginBottom: '20px',
    counterIncrement: 'item',
  },

  '& > li:before': {
    content: 'counters(item, ".") "."',
    display: 'table-cell',
    paddingRight: '9px',
  },

  '& > li > ol': {
    counterReset: 'item',
  },

  '& > li > ol > li': {
    fontWeight: 'normal',
    marginBottom: '9px',
    counterIncrement: 'item',
    display: 'table',

    '& ol': {
      listStyleType: 'lower-roman',
      paddingLeft: '10px',
    },
  },

  '& > li > ol > li:before': {
    content: 'counters(item, ".") " "',
    display: 'table-cell',
    paddingRight: '9px',
  },

  '@media (max-width: 768px)': {
    paddingLeft: '8px',
  },
});

export const termsSectionTitle = css({
  fontSize: '1.125rem',
  paddingTop: '18px',
  marginBottom: '7.2px',
});
