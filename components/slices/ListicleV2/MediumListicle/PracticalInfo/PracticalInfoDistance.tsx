import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoDistanceAndTimeWrapper,
  PracticalInfoDistanceContentWrapper,
  PracticalInfoDistanceIconWrapper,
  PracticalInfoDotIconWrapper,
  PracticalInfoTimeContentWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import { DISTANCE, DOT } from 'assets/SvgIcons';

const PracticalInfoDistance = ({ distance, duration }: IPracticalInfoProps) => {
  return (
    <PracticalInfoDistanceAndTimeWrapper>
      <PracticalInfoDistanceIconWrapper>
        {DISTANCE()}
      </PracticalInfoDistanceIconWrapper>
      <PracticalInfoDistanceContentWrapper>
        {distance}
      </PracticalInfoDistanceContentWrapper>
      <PracticalInfoDotIconWrapper>{DOT()}</PracticalInfoDotIconWrapper>
      <PracticalInfoTimeContentWrapper>
        {duration}
      </PracticalInfoTimeContentWrapper>
    </PracticalInfoDistanceAndTimeWrapper>
  );
};
export default PracticalInfoDistance;
