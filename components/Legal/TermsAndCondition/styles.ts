import { css } from '@headout/pixie/css';

export const contentContainer = css({
  maxWidth: '1200px',
  margin: '100px auto 10px',
  color: '#545454',

  '& ol': {
    listStyleType: 'none',
    counterReset: 'item',
    paddingInlineStart: '0',
  },

  '& > li': {
    display: 'table',
    fontWeight: 'bold',
    marginBottom: '24px',
    counterIncrement: 'item',
    '&:before': {
      content: "counters(item, '.') '. '",
      display: 'table-cell',
      paddingRight: '0.6em',
    },
  },
  '& > li > ol > li': {
    fontWeight: 'normal',
    marginBottom: '10px',
    counterIncrement: 'item',
    display: 'table',

    '&:before': {
      content: "counters(item, '.') ' '",
      display: 'table-cell',
      paddingRight: '10px',
    },

    '& ol': {
      listStyleType: 'lower-roman',
      paddingLeft: '16px',
    },
  },
});

export const topHeading = css({
  fontSize: '2.188rem',
  fontWeight: '500',
  color: 'core.primary.black',
  borderLeft: '3px solid #669dde',
  fontFamily: 'font.family.ht',
  padding: '5px 20px 5px',
  margin: '24px 0',
});

export const paragraph = css({
  fontFamily: 'font.family.ht',
  color: '#545454',
  lineHeight: '1.5',
  margin: '16px 0',
  '& b, & strong': {
    fontWeight: '500',
  },
  '& a': {
    color: 'core.candy.600',
    textDecoration: 'none',
  },
});

export const subHeading = css({
  fontWeight: '600',
  fontSize: '1.25rem',
  color: '#545454',
  margin: '20px 0',
});
