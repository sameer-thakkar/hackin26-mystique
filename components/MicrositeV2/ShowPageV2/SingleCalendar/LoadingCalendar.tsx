// eslint-disable-next-line simple-import-sort/imports
import React from 'react';
/* eslint-disable-next-line no-restricted-imports */
import styled from 'styled-components';
/* Components, Assets */
import { CALENDAR_CONSTS } from './constants';
/* Colors */
import COLORS from 'const/colors';
import Skeleton from 'react-loading-skeleton';

const { REGULAR_DUMMY_CAL_ROWS_COUNT } = CALENDAR_CONSTS;

const CalendarContainer = styled.div`
  background: ${COLORS.BRAND.WHITE};
  border-radius: 0.5rem;

  .calendar-content {
    display: flex;
  }
`;

const MonthWrapper = styled.div`
  max-width: 24rem;
`;

const TopBar = styled.div`
  padding: 1rem 1rem 0.75rem;
  position: relative;
  border-radius: 0.5rem;

  .month-name {
    margin-left: 0rem;
    height: 2rem;
    width: 10rem;
    border-radius: 0.5rem;
  }

  .week-days {
    margin-top: 0.75rem;
    width: 22rem;
    height: 1.25rem;
    border-radius: 0.5rem;
  }
`;

const CalendarBody = styled.div`
  padding: 1.375rem 1rem 1.5rem;

  .date-row {
    width: 22rem;
    height: 3.25rem;
    margin-top: 0.25rem;
    border-radius: 0.5rem;

    &.row-1,
    &.row-5 {
      width: 17rem;
    }

    &.row-1 {
      margin-left: 5rem;
    }
  }
`;

export const LoadingCalendar = () => {
  const getRegularCalendar = () => {
    const getMonthWrapper = () => (
      <MonthWrapper>
        <TopBar>
          <Skeleton className="month-name" />
          <Skeleton className="week-days" />
        </TopBar>
        <CalendarBody>
          {Array.from({ length: REGULAR_DUMMY_CAL_ROWS_COUNT }).map((_, i) => (
            <Skeleton key={i} className={`date-row row-${i + 1}`} />
          ))}
        </CalendarBody>
      </MonthWrapper>
    );

    return (
      <CalendarContainer>
        <div className="calendar-content">{getMonthWrapper()}</div>
      </CalendarContainer>
    );
  };

  return getRegularCalendar();
};
