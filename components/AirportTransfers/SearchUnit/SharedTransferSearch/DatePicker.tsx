import { useRecoilState } from 'recoil';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { BasicCalendar } from '../BasicCalendarDesktop';
import { BasicCalendarMobile } from '../BasicCalendarMobile';
import { sharedTransferDate } from '../state';

type TDatePickerProps = {
  onValueChange: () => void;
  isMobile?: boolean;
  hasError?: boolean;
};

export const DatePicker = ({
  onValueChange,
  isMobile = true,
  hasError,
}: TDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useRecoilState(sharedTransferDate);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onValueChange();

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_APPLIED,

      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]: 'Date',
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_VALUE]: date,
    });
  };

  if (!isMobile) {
    return (
      <BasicCalendar
        onDateSelect={(date) => handleDateSelect(date.format('YYYY-MM-DD'))}
        selectedDate={selectedDate ?? ''}
        hasError={hasError}
      />
    );
  }
  return (
    <BasicCalendarMobile
      date={selectedDate ?? ''}
      onDateSelect={(date) => handleDateSelect(date.format('YYYY-MM-DD'))}
    />
  );
};
