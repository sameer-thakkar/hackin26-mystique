import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoSeasonContentWrapper,
  PracticalInfoSeasonIconWrapper,
  PracticalInfoSeasonWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import Season from 'assets/season';

const PracticalInfoSeason = ({ season }: IPracticalInfoProps) => {
  return (
    <PracticalInfoSeasonWrapper>
      <PracticalInfoSeasonIconWrapper>
        <Season />
      </PracticalInfoSeasonIconWrapper>
      <PracticalInfoSeasonContentWrapper>
        {season}
      </PracticalInfoSeasonContentWrapper>
    </PracticalInfoSeasonWrapper>
  );
};
export default PracticalInfoSeason;
