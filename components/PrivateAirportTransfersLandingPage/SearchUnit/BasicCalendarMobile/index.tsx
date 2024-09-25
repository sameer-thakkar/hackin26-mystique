import dayjs, { Dayjs } from 'dayjs';
import isTodayPlugin from 'dayjs/plugin/isToday';
import weekdayPlugin from 'dayjs/plugin/weekday';
import { generateDaysInMonth, getNMonthsFromNow } from 'utils/dateUtils';
import {
  CalendarContainer,
  DatesWrapper,
  MonthsWrapper,
  MonthWrapper,
  StyledDay,
  WeekdaysWrapper,
} from './styles';

const MAX_MONTH_AVAILABLE = 3;

dayjs.extend(weekdayPlugin);
dayjs.extend(isTodayPlugin);

export const BasicCalendarMobile = ({
  date,
  onDateSelect,
}: {
  date: string; // 'YYYY-MM-DD'
  onDateSelect: (date: Dayjs) => void;
}) => {
  const months = getNMonthsFromNow(MAX_MONTH_AVAILABLE);

  const handleDateClick = (day: number | null, month: Dayjs) => {
    if (!day) {
      return;
    }

    const completeDate = month.date(day);

    const isBeforeToday = completeDate.isBefore(dayjs(), 'day');

    if (isBeforeToday) {
      return;
    }

    onDateSelect(completeDate);
  };

  return (
    <CalendarContainer data-qa-marker="calendar-mobile">
      <WeekdaysWrapper>
        {Array.from({ length: 7 }).map((_, i) => {
          return (
            <span className="weekday" key={i}>
              {dayjs().weekday(i).format('ddd')}
            </span>
          );
        })}
      </WeekdaysWrapper>

      <MonthsWrapper>
        {months.map((month, i) => {
          return (
            <MonthWrapper key={i}>
              <h4>{month.format('MMMM YYYY')}</h4>

              <DatesWrapper key={i}>
                {generateDaysInMonth(month).map((day, i) => {
                  const isToday = !!day && month.date(day).isToday();

                  const isDayBeforeToday =
                    !!day && month.date(day).isBefore(dayjs(), 'day');

                  const isSelectedDate =
                    !!day && month.date(day).format('YYYY-MM-DD') === date;

                  const qaMarker = day
                    ? `calendar-day${
                        isDayBeforeToday ? '-disabled' : '-available'
                      }-${day}`
                    : '';

                  return (
                    <StyledDay
                      data-qa-marker={qaMarker}
                      key={i}
                      onClick={() => handleDateClick(day, month)}
                      $isToday={isToday}
                      $isBeforeToday={isDayBeforeToday}
                      $isSelected={isSelectedDate}
                    >
                      {day}
                    </StyledDay>
                  );
                })}
              </DatesWrapper>
            </MonthWrapper>
          );
        })}
      </MonthsWrapper>
    </CalendarContainer>
  );
};
