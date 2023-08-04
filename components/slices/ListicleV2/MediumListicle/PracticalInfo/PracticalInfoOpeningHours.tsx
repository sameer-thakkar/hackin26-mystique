// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoTimingsContentWrapper,
  PracticalInfoTimingsIconWrapper,
  PracticalInfoTimingsWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import { TIMING } from 'assets/SvgIcons';

const PracticalInfoOpeningHours = ({ openingHours }: IPracticalInfoProps) => {
  return (
    <PracticalInfoTimingsWrapper>
      <PracticalInfoTimingsIconWrapper>
        {TIMING()}
      </PracticalInfoTimingsIconWrapper>
      <PracticalInfoTimingsContentWrapper>
        <RichText render={openingHours} />
      </PracticalInfoTimingsContentWrapper>
    </PracticalInfoTimingsWrapper>
  );
};
export default PracticalInfoOpeningHours;
