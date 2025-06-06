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

export const pageHeading = css({
  marginBottom: 'space.16',
  textStyle: 'heading.large',
});

export const lastUpdated = css({
  fontSize: '0.9375rem',
  margin: '18px 0',
  '@media (max-width: 768px)': {
    fontSize: '0.875rem',
    margin: '10px 0',
  },
});

export const sectionHeading = css({
  marginBottom: '4px',
  paddingTop: '10px',
  textStyle: 'heading.regular',
});

export const policyItem = css({
  marginBottom: '9px',
  textStyle: 'para.medium',
  lineHeight: 1.5,
  _before: {
    textStyle: 'para.medium',
  },
  '& b': { fontWeight: 'bold' },

  '@media (max-width: 768px)': {
    textStyle: 'para.regular',
    _before: {
      textStyle: 'para.regular',
    },
  },
});

export const policyList = css({
  listStyleType: 'none',
  counterReset: 'item',
  '& ul': {
    listStyle: 'disc',
    marginTop: '6px',
    '& .unstyled-list': {
      listStyle: 'none',
      paddingInlineStart: '0',
    },
    '& li': { marginBottom: '6px' },
  },

  '@media (max-width: 768px)': {
    marginLeft: '10px',
    '& ul': { paddingInlineStart: '40px' },
  },
});

export const policySectionStyles = css({
  display: 'table',
  marginBottom: '10px',
  counterIncrement: 'item',

  '@media (max-width: 768px)': { marginBottom: '20px' },

  '&:before': {
    content: "counters(item, '.') '. '",
    display: 'table-cell',
    paddingRight: '2px',
    textStyle: 'heading.regular',

    '@media (max-width: 768px)': { paddingRight: '9px' },
  },

  '& > ol': { counterReset: 'item' },

  '& > ol > li': {
    marginBottom: '9px',
    counterIncrement: 'item',
    display: 'table',
    '&:before': {
      content: "counters(item, '.') '. '",
      display: 'table-cell',
      paddingRight: '2px',
      '@media (max-width: 768px)': { paddingRight: '9px' },
    },
    '& ol': {
      listStyleType: 'none',
      marginTop: '6px',
      counterReset: 'item 0',
      '@media (max-width: 768px)': { paddingLeft: '10px' },
      '& > li': {
        marginBottom: '6px',
        counterIncrement: 'item',
        display: 'table',
        '&:before': {
          content: "counters(item, '.') '. '",
          display: 'table-cell',
          paddingRight: '2px',
          '@media (max-width: 768px)': { paddingRight: '6px' },
        },
      },
    },
  },
});

export const italicUnderlineStyles = css({
  fontStyle: 'italic',
  textDecoration: 'underline',
  textStyle: 'para.medium',

  '@media (max-width: 768px)': {
    textStyle: 'para.regular',
  },
});

export const tableStyles = css({
  width: '100%',
  marginBottom: '20px',
  border: '1px solid #ddd',
  borderCollapse: 'collapse',
});

export const tableHeaderStyles = css({
  backgroundColor: 'gray.g8',
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '2px solid #ddd',
  textStyle: 'para.medium',
});

export const tableRowStyles = css({
  '&:nth-of-type(even)': {
    backgroundColor: '#f9f9f9',
  },
});

export const tableCellStyles = css({
  padding: '12px',
  borderBottom: '1px solid #ddd',
  textStyle: 'para.medium',

  '@media (max-width: 768px)': {
    textStyle: 'para.regular',
    padding: '8px',
  },
});
