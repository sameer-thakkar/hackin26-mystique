import Conditional from 'components/common/Conditional';
import { IPracticalInfoProps } from 'components/slices/ListicleV2/MediumListicle/PracticalInfo/interfaces';
import {
  PracticalInfoFindItOnMapWrapper,
  PracticalInfoLocationContentWrapper,
  PracticalInfoLocationIconWrapper,
  PracticalInfoLocationNameWrapper,
  PracticalInfoLocationWrapper,
} from 'components/slices/ListicleV2/MediumListicle/SettingsContainer/styles';
import { strings } from 'const/strings';
import Location from 'assets/location';

const PracticalInfoLocation = ({
  location,
  findItOnMap,
  onClickMapLink,
}: IPracticalInfoProps) => {
  return (
    <PracticalInfoLocationWrapper>
      <PracticalInfoLocationIconWrapper>
        {Location}
      </PracticalInfoLocationIconWrapper>
      <PracticalInfoLocationContentWrapper>
        <PracticalInfoLocationNameWrapper>
          {location}
        </PracticalInfoLocationNameWrapper>
        <Conditional if={findItOnMap}>
          <PracticalInfoFindItOnMapWrapper>
            <a
              href={findItOnMap}
              target={'_blank'}
              rel="noreferrer noopener"
              onClick={onClickMapLink}
            >
              {strings.FIND_ON_MAP}
            </a>
          </PracticalInfoFindItOnMapWrapper>
        </Conditional>
      </PracticalInfoLocationContentWrapper>
    </PracticalInfoLocationWrapper>
  );
};
export default PracticalInfoLocation;
