import { useRecoilState } from 'recoil';
import { Dayjs } from 'dayjs';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { BasicCalendar } from '../BasicCalendarDesktop';
import { BasicCalendarMobile } from '../BasicCalendarMobile';
import { privateTransferDateState } from '../state';

export const DatePicker = ({
  isMobile = true,
  onValueChange,
  hasError,
}: {
  isMobile?: boolean;
  onValueChange: () => void;
  hasError?: boolean;
}) => {
  const [date, setDate] = useRecoilState(privateTransferDateState);

  const handleDateSelect = (date: Dayjs) => {
    setDate(date.format('YYYY-MM-DD'));
    onValueChange();

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_APPLIED,

      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]: 'Date',
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_VALUE]: date,
    });
  };

  if (isMobile) {
    return (
      <BasicCalendarMobile date={date ?? ''} onDateSelect={handleDateSelect} />
    );
  }

  return (
    <BasicCalendar
      selectedDate={date ?? ''}
      onDateSelect={handleDateSelect}
      hasError={hasError}
    />
  );
};
