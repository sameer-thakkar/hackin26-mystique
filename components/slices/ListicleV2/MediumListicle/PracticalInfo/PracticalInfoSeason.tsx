import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoSeasonContentWrapper,
  PracticalInfoSeasonIconWrapper,
  PracticalInfoSeasonWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import { SEASON } from 'assets/SvgIcons';

const PracticalInfoSeason = ({ season }: IPracticalInfoProps) => {
  return (
    <PracticalInfoSeasonWrapper>
      <PracticalInfoSeasonIconWrapper>
        {SEASON()}
      </PracticalInfoSeasonIconWrapper>
      <PracticalInfoSeasonContentWrapper>
        {season}
      </PracticalInfoSeasonContentWrapper>
    </PracticalInfoSeasonWrapper>
  );
};
export default PracticalInfoSeason;
