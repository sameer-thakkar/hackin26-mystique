import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import dayjs, { Dayjs } from 'dayjs';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { DrawerList, DrawerListItem } from '../BottomDrawer';
import { TIME_FORMAT, TIME_FORMAT_DISPLAY } from '../constants';
import { privateTransferDateState, privateTransferTimeState } from '../state';
import { ScrollableTimePicker } from '../TimePickerMobile';
import { getDayTimes } from './utils';

export const TimePicker = ({
  isMobile = true,
  onValueChange,
}: {
  isMobile?: boolean;
  onValueChange: () => void;
}) => {
  const [time, setTime] = useRecoilState(privateTransferTimeState);

  const trackTimeSelect = (time: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_TIME_SELECTED,
      [ANALYTICS_PROPERTIES.EXPERIENCE_TIME]: time,
    });
  };

  if (isMobile) {
    return (
      <ScrollableTimePicker
        initTime={time ?? ''}
        onTimeSelect={(time: Dayjs) => {
          setTime(time.format(TIME_FORMAT));
          trackTimeSelect(time.format(TIME_FORMAT));
        }}
      />
    );
  }

  return (
    <TimeDropdown
      selectedTime={time ?? ''}
      onTimeSelect={(time: string) => {
        setTime(time);
        onValueChange();
        trackTimeSelect(time);
      }}
    />
  );
};

const StyledDrawerList = styled(DrawerList)`
  margin-block-start: -0.5rem;
`;

const StyledDrawerListItem = styled(DrawerListItem)`
  @media (min-width: 768px) {
    margin-bottom: 0.25rem;
  }
`;

const TimeDropdown = ({
  selectedTime,
  onTimeSelect,
}: {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}) => {
  const pickupDate = useRecoilValue(privateTransferDateState);
  const isToday = dayjs().isSame(pickupDate, 'day');

  return (
    <StyledDrawerList>
      {getDayTimes(isToday).map((time, index) => (
        <StyledDrawerListItem
          key={time}
          onClick={() => onTimeSelect(time)}
          data-qa-marker={`time-list-item-${index}`}
          title={dayjs(time, TIME_FORMAT).format(TIME_FORMAT_DISPLAY)}
          isSelected={time === selectedTime}
        />
      ))}
    </StyledDrawerList>
  );
};
