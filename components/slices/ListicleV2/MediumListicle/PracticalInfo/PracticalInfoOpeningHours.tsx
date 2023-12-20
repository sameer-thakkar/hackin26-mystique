import { PrismicRichText } from '@prismicio/react';
import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoTimingsContentWrapper,
  PracticalInfoTimingsIconWrapper,
  PracticalInfoTimingsWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import { shortCodeSerializer } from 'utils/shortCodes';
import { TIMING } from 'assets/SvgIcons';

const PracticalInfoOpeningHours = ({ openingHours }: IPracticalInfoProps) => {
  return (
    <PracticalInfoTimingsWrapper>
      <PracticalInfoTimingsIconWrapper>
        {TIMING()}
      </PracticalInfoTimingsIconWrapper>
      <PracticalInfoTimingsContentWrapper>
        <PrismicRichText
          field={openingHours}
          components={shortCodeSerializer}
        />
      </PracticalInfoTimingsContentWrapper>
    </PracticalInfoTimingsWrapper>
  );
};
export default PracticalInfoOpeningHours;
