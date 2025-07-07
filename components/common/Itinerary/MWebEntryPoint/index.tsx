import type { TMWebEntryPointProps } from 'components/common/Itinerary/MWebEntryPoint/interface';
import { StyledMWebEntryPointContainer } from 'components/common/Itinerary/MWebEntryPoint/styles';
import { strings } from 'const/strings';
import { MapSVG } from 'assets/airportTransfers';
import MapRouteSvg from 'assets/mapRoute';

const MWebEntryPoint = ({
  onClick,
  isHOHOItinerary = false,
}: TMWebEntryPointProps) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <StyledMWebEntryPointContainer
      onClick={handleClick}
      data-qa-marker="qaid-itinerary-entry-point"
    >
      <div className="entrypoint-content-wrapper">
        <div className="bg-image">
          <MapRouteSvg height={66} width={59} />
        </div>
        <div className="entrypoint-content">
          <MapSVG />
          <p className="cta-label">
            {isHOHOItinerary ? strings.HOHO.ROUTES : strings.ITINERARY.TAB}
          </p>
        </div>
      </div>
    </StyledMWebEntryPointContainer>
  );
};

export default MWebEntryPoint;
