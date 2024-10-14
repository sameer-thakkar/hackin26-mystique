import { useContext } from 'react';
import { useRecoilState } from 'recoil';
import dayjs, { Dayjs } from 'dayjs';
import { MBContext } from 'contexts/MBContext';
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

  const { lang } = useContext(MBContext);

  dayjs.locale(lang);

  const handleDateSelect = (date: Dayjs) => {
    const formattedDate = date.format('YYYY-MM-DD');
    setDate(formattedDate);
    onValueChange();

    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_DATE_SELECTED,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: formattedDate,
      [ANALYTICS_PROPERTIES.LEAD_TIME_DAYS]: date.diff(
        dayjs().startOf('day'),
        'day'
      ),
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
