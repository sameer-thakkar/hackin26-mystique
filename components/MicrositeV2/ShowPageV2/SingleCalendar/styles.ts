import { css } from '@headout/pixie/css';

const calendarWrapper = css({
  background: '#fff',
  borderRadius: '24px 24px 0 0',
  borderBottom: 'none',
  boxShadow: 'none',
  padding: 0,
  display: 'inline-block',
  width: '24rem',
  '@media (max-width: 767px)': {
    width: 'calc(100% - 13px)',
    margin: '0 auto',
    display: 'block',
  },
});

const calendarContainer = css({
  display: 'flex',
  marginBottom: 'space.12',
});

const topBar = css({
  background: 'none',
  borderBottom: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'relative',
  '& .monthName': {
    fontSize: 'font.size.24',
    fontWeight: 700,
    color: '#333',
    margin: 0,
    padding: 0,
    lineHeight: '32px',
    textAlign: 'left',
    letterSpacing: 0,
  },
  '& .chevron-icon': {
    position: 'absolute',
    top: 'space.16',
    right: 'space.16',
    display: 'flex',
    gap: 'space.8',
    '& .nav-btn': {
      width: '2.25rem',
      height: '2.25rem',
      borderRadius: '50%',
      border: '1px solid #E0E0E0',
      background: 'core.primary.white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
      cursor: 'pointer',
      transition: 'border 0.2s, opacity 0.2s',
      '& svg': {
        width: '20px',
        height: '20px',
        color: '#6B6B6B',
        display: 'block',
        margin: 0,
      },
      '&[aria-disabled="true"], &[disabled]': {
        pointerEvents: 'none',
        opacity: 0.5,
        border: '1px solid #E0E0E0',
        background: 'core.primary.white',
      },
    },
  },
  '& .day-list-container-dual-month': {
    marginTop: 'space.12',
    paddingBottom: 'space.20',
    marginBottom: 'space.12',
    borderBottom: '1px solid',
    borderColor: 'core.grey.200',
    width: '100%',
    '& .day-list': {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 3.125rem)',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      gap: '2px',
      padding: 0,
      '& .day-wrapper': {
        flex: 'none',
        textAlign: 'center',
        maxWidth: '3.125rem',
        minWidth: '3.125rem',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        '& span': {
          fontSize: 'font.size.16',
          fontWeight: 500,
          color: '#6B6B6B',
          lineHeight: 'lh.20',
          letterSpacing: 0,
          display: 'block',
          width: '100%',
          textAlign: 'center',
        },
      },
    },
  },
});

const monthNavButtons = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'space.8',
  justifyContent: 'flex-end',
  marginRight: 'space.16',
});

const monthWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  '&.calendar-body-wrapper': {
    display: 'flex',
    height: '100%',
    marginTop: 'space.24',
    '@media (max-width: 767px)': {
      marginTop: 'space.8',
    },
  },
});

const calendarBody = css({
  width: '100%',
  boxSizing: 'content-box',
  '@media (max-width: 767px)': {
    width: '100%',
  },
});

const dateComponentsWrapper = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 3.125rem)',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: '2px',
  padding: 0,
  margin: 0,
});

const monthTitle = css({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  marginTop: 'space.16',
  flex: 1,
  '& .monthName': {
    textStyle: 'Semantics/Heading/Medium',
    color: 'core.grey.800',
    userSelect: 'none',
    '&.first': {
      marginLeft: '1rem',
    },
  },
});

const styledFootNote = css({
  borderTop: '1px solid',
  borderColor: 'core.grey.200',
  paddingTop: 'space.16',
});

const calendarBodyWrapper = css({
  justifyContent: 'center',
  margin: '0 4px',
});

const arrowButton = css({
  color: 'semantic.text.light.grey.8',
  width: '2rem',
  height: '2rem',
  border: '1px solid',
  borderColor: 'core.grey.300',
  borderRadius: 'radius.50p',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '&:first-child': {
    transform: 'rotate(180deg)',
  },
  '& path': {
    stroke: 'core.grey.700',
  },
  '&[aria-disabled="true"]': {
    cursor: 'not-allowed',
    border: '0.98px solid',
    borderColor: 'core.grey.500',
    opacity: 0.4,
    '& path': {
      stroke: 'core.grey.500',
    },
    _hover: {
      borderColor: 'core.grey.500',
      '& path': {
        stroke: 'core.grey.500',
      },
    },
    _active: {
      borderColor: 'core.grey.500',
      '& path': {
        stroke: 'core.grey.500',
      },
    },
  },
  '&:hover': {
    borderColor: 'core.grey.500',
    '& path': {
      stroke: 'core.grey.700',
    },
  },
  '&:active': {
    borderColor: 'core.grey.700',
    '& path': {
      stroke: 'core.grey.700',
    },
  },
});

const singleCalendarDateWrapper = css({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '3rem',
  maxWidth: '3rem',
  minHeight: '3rem',
  maxHeight: '3rem',
  border: '1px solid',
  borderBottom: '2px solid',
  borderColor: 'transparent',
  cursor: 'pointer',
  transition: 'background 0.2s cubic-bezier(0.7, 0, 0.3, 1)',
  userSelect: 'none',
  '&.empty': {
    pointerEvents: 'none',
    outline: 'none',
    cursor: 'auto',
    background: 'none',
  },
  '&.unavailable': {
    cursor: 'not-allowed',
    '& .date-label span': {
      color: 'core.grey.600',
    },
    '& .price': {
      color: 'core.grey.600',
    },
  },
  '&.selected-date': {
    background: 'core.purps.10',
    border: '1px solid',
    borderBottom: '2px solid',
    borderColor: 'core.purps.100',
    borderRadius: 'radius.8',
    _hover: {
      background: 'core.purps.20',
      borderColor: 'core.purps.100',
      transform: 'scale(1)',
      border: '1px solid',
      paddingBottom: '0',
      borderBottom: '2px solid',
    },
    _active: {
      background: 'core.purps.30',
      borderColor: 'core.purps.100',
      transform: 'scale(0.98)',
      transition: 'transform 0.2s cubic-bezier(0.7, 0, 0.3, 1)',
    },
  },
  '@media (min-width: 768px)': {
    _hover: {
      borderRadius: 'radius.8',
      borderColor: 'core.grey.300',
      background: 'core.grey.100',
      paddingBottom: 'space.1',
      border: '1px solid',
      borderBottom: '1px solid',
      transform: 'scale(1)',
    },
    _active: {
      transform: 'scale(0.98)',
      transition: 'transform 0.2s cubic-bezier(0.7, 0, 0.3, 1)',
    },
  },
});

const dateLabel = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '& span': {
    textStyle: 'Semantics/UI Label/Large (Heavy)',
    color: 'core.grey.900',
    display: 'block',
    width: '100%',
    textAlign: 'center',
  },
});

const priceWrapper = css({
  width: '100%',
  marginTop: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const price = css({
  display: 'block',
  margin: 0,
  padding: 0,
  width: '100%',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  '& .price': {
    textStyle: 'Semantics/UI Label/Extra Small',
    color: 'semantic.text.grey.2',
    background: 'none',
    borderRadius: 'radius.2',
    paddingBottom: 'space.1',
  },
  '& .price.min-price': {
    background: 'core.okaygreen.100',
    color: 'core.okaygreen.700',
    borderRadius: 'radius.2',
    paddingBottom: 'space.1',
  },
  '& .faded-price::after': {
    content: 'attr(faded-chars)',
    opacity: 0.4,
  },
});

const cutPrice = css({
  fontSize: '13px',
  fontWeight: 700,
  color: '#B0B0B0',
  textDecoration: 'line-through',
  marginLeft: 'space.4',
});

const soldOut = css({
  fontSize: 'font.size.15',
  fontWeight: 500,
  color: '#B0B0B0',
  textTransform: 'capitalize',
  textAlign: 'center',
});

const disabledDate = css({
  pointerEvents: 'none',
  cursor: 'not-allowed',

  '& .date-label span': {
    color: 'core.grey.600',
  },
  '& .price': {
    color: 'core.grey.600',
  },
});

const disabledDateLabel = css({
  '& span': {
    color: 'core.grey.600',
  },
});

const borderBottomRadius = css({
  borderBottomLeftRadius: '24px',
  borderBottomRightRadius: '24px',
});

export default {
  calendarWrapper,
  calendarContainer,
  topBar,
  monthWrapper,
  calendarBody,
  dateComponentsWrapper,
  monthTitle,
  styledFootNote,
  calendarBodyWrapper,
  arrowButton,
  singleCalendarDateWrapper,
  dateLabel,
  priceWrapper,
  price,
  cutPrice,
  soldOut,
  monthNavButtons,
  disabledDate,
  disabledDateLabel,
  borderBottomRadius,
};
