import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoCalendarContentWrapper,
  PracticalInfoCalendarIconWrapper,
  PracticalInfoCalendarWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import PracticalInfoCalendarIcon from 'assets/practicalInfoCalendar';

const PracticalInfoCalendar = ({
  calendar,
  isSettingsOne,
}: IPracticalInfoProps) => {
  return (
    <PracticalInfoCalendarWrapper isSettingsOne={isSettingsOne}>
      <PracticalInfoCalendarIconWrapper>
        <PracticalInfoCalendarIcon />
      </PracticalInfoCalendarIconWrapper>
      <PracticalInfoCalendarContentWrapper>
        {calendar}
      </PracticalInfoCalendarContentWrapper>
    </PracticalInfoCalendarWrapper>
  );
};
export default PracticalInfoCalendar;
