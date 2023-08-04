import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoCalendarContentWrapper,
  PracticalInfoCalendarIconWrapper,
  PracticalInfoCalendarWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import { PRACTICAL_INFO_CALENDAR } from 'assets/SvgIcons';

const PracticalInfoCalendar = ({
  calendar,
  isSettingsOne,
}: IPracticalInfoProps) => {
  return (
    <PracticalInfoCalendarWrapper isSettingsOne={isSettingsOne}>
      <PracticalInfoCalendarIconWrapper>
        {PRACTICAL_INFO_CALENDAR()}
      </PracticalInfoCalendarIconWrapper>
      <PracticalInfoCalendarContentWrapper>
        {calendar}
      </PracticalInfoCalendarContentWrapper>
    </PracticalInfoCalendarWrapper>
  );
};
export default PracticalInfoCalendar;
