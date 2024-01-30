import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoDistanceAndTimeWrapper,
  PracticalInfoDistanceContentWrapper,
  PracticalInfoDistanceIconWrapper,
  PracticalInfoDotIconWrapper,
  PracticalInfoTimeContentWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import Distance from 'assets/distance';
import Dot from 'assets/dot';

const PracticalInfoDistance = ({ distance, duration }: IPracticalInfoProps) => {
  return (
    <PracticalInfoDistanceAndTimeWrapper>
      <PracticalInfoDistanceIconWrapper>
        {Distance()}
      </PracticalInfoDistanceIconWrapper>
      <PracticalInfoDistanceContentWrapper>
        {distance}
      </PracticalInfoDistanceContentWrapper>
      <PracticalInfoDotIconWrapper>{Dot()}</PracticalInfoDotIconWrapper>
      <PracticalInfoTimeContentWrapper>
        {duration}
      </PracticalInfoTimeContentWrapper>
    </PracticalInfoDistanceAndTimeWrapper>
  );
};
export default PracticalInfoDistance;
