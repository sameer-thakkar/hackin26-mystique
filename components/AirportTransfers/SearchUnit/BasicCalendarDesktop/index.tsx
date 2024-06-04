import { forwardRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isTodayPlugin from 'dayjs/plugin/isToday';
import weekdayPlugin from 'dayjs/plugin/weekday';
import Conditional from 'components/common/Conditional';
import { generateDaysInMonth } from 'utils/dateUtils';
import ChevronLeft from 'assets/chevronLeft';
import {
  CalendarDropdownContainer,
  DatesWrapper,
  Day,
  HeaderContainer,
  MonthSwitcher,
  MonthTitle,
  WeekDay,
  WeekdaysWrapper,
} from './style';

dayjs.extend(weekdayPlugin);
dayjs.extend(isTodayPlugin);

const MONTH_FORMAT = 'MMMM YYYY';
const WEEKDAY_FORMAT = 'ddd';

const MAX_MONTH_AVAIABLE = 3;

export const BasicCalendar = forwardRef<
  HTMLDivElement,
  {
    onDateSelect: (date: Dayjs) => void;
    selectedDate: string;
    hasError?: boolean;
  }
>(function BasicCalendarWithoutRef(
  { onDateSelect, selectedDate, hasError },
  ref
) {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? dayjs(selectedDate) : dayjs()
  );

  const [arrayOfDays, setArrayOfDays] = useState<(number | null)[]>(
    generateDaysInMonth(currentMonth)
  );

  const handleNextClick = () => {
    const newMonth = currentMonth.add(1, 'month');

    if (newMonth.isAfter(dayjs().add(MAX_MONTH_AVAIABLE, 'month'), 'month')) {
      return;
    }

    const daysForMonth = generateDaysInMonth(newMonth);

    setArrayOfDays(daysForMonth);

    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const handlePrevClick = () => {
    const newMonth = currentMonth.subtract(1, 'month');

    if (newMonth.isBefore(dayjs(), 'month')) {
      return;
    }

    const daysForMonth = generateDaysInMonth(newMonth);

    setArrayOfDays(daysForMonth);

    setCurrentMonth(newMonth);
  };

  const handleDateClick = (date: number | null) => {
    if (!date || currentMonth.date(date).isBefore(dayjs(), 'day')) {
      return;
    }

    const completeDate = currentMonth.date(date);

    onDateSelect(completeDate);
  };

  const isPrevMonthBeforeNow = currentMonth
    .subtract(1, 'month')
    .isBefore(dayjs(), 'month');

  const isNextMonthAfterMax = currentMonth
    .add(1, 'month')
    .isAfter(dayjs().add(MAX_MONTH_AVAIABLE, 'month'), 'month');

  return (
    <CalendarDropdownContainer
      ref={ref}
      data-qa-marker="calendar-container"
      $hasError={hasError}
    >
      <HeaderContainer>
        <MonthSwitcher>
          <Conditional if={!isPrevMonthBeforeNow}>
            <button
              onClick={handlePrevClick}
              data-qa-maker="calendar-month-switcher-prev"
            >
              {ChevronLeft}
            </button>
          </Conditional>

          <MonthTitle>{currentMonth.format(MONTH_FORMAT)}</MonthTitle>

          <Conditional if={!isNextMonthAfterMax}>
            <button
              onClick={handleNextClick}
              data-qa-maker="calendar-month-switcher-next"
            >
              {ChevronLeft}
            </button>
          </Conditional>
        </MonthSwitcher>

        <WeekdaysWrapper>
          {Array.from({ length: 7 }).map((_, i) => {
            return (
              <WeekDay key={i}>
                {dayjs().weekday(i).format(WEEKDAY_FORMAT)}
              </WeekDay>
            );
          })}
        </WeekdaysWrapper>
      </HeaderContainer>

      <DatesWrapper>
        {arrayOfDays.map((day, index) => {
          const isToday = !!day && currentMonth.date(day).isToday();

          const isBeforeToday =
            !!day && currentMonth.date(day).isBefore(dayjs(), 'day');

          const qaMarker = day
            ? `calendar-day${isBeforeToday ? '-disabled' : '-available'}-${day}`
            : '';

          return (
            <Day
              $isEmpty={day === null}
              data-qa-marker={qaMarker}
              key={index}
              onClick={() => handleDateClick(day)}
              $isSelected={
                !!day &&
                currentMonth.date(day).format('YYYY-MM-DD') === selectedDate
              }
              $isToday={isToday}
              $isBeforeToday={isBeforeToday}
            >
              {day}
            </Day>
          );
        })}
      </DatesWrapper>
    </CalendarDropdownContainer>
  );
});
