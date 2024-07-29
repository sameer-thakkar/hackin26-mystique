import type { TMWebEntryPointProps } from 'components/common/Itinerary/MWebEntryPoint/interface';
import { StyledMWebEntryPointContainer } from 'components/common/Itinerary/MWebEntryPoint/styles';
import { strings } from 'const/strings';
import { MapSVG } from 'assets/airportTransfers';
import MapRouteSvg from 'assets/mapRoute';

const MWebEntryPoint = ({ onClick }: TMWebEntryPointProps) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <StyledMWebEntryPointContainer onClick={handleClick}>
      <div className="entrypoint-content-wrapper">
        <div className="bg-image">
          <MapRouteSvg height={66} width={59} />
        </div>
        <div className="entrypoint-content">
          <MapSVG />
          <p className="cta-label">{strings.CATEGORY_HEADER.ITINERARY}</p>
        </div>
      </div>
    </StyledMWebEntryPointContainer>
  );
};

export default MWebEntryPoint;
