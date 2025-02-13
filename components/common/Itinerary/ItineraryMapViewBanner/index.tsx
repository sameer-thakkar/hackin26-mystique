import type { TItineraryMapViewBannerComponentProps } from 'components/common/Itinerary/ItineraryMapViewBanner/interface';
import { StyledItineraryMapViewBanner } from 'components/common/Itinerary/ItineraryMapViewBanner/styles';
import Image from 'UI/Image';
import COLORS from 'const/colors';
import {
  ITINERARY_MAP_BANNER_BG_IMAGE,
  ITINERARY_MAP_BANNER_ICON_IMAGE,
} from 'const/itinerary';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';

const ItineraryMapViewBanner = ({
  onClick,
}: TItineraryMapViewBannerComponentProps) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <StyledItineraryMapViewBanner
      onClick={handleClick}
      data-qa-marker="qaid-itinerary-map-view-banner"
    >
      <div className="content">
        <span className="label">
          {strings.ITINERARY.VIEW_EXPERIENCE_MAPPED_OUT}
        </span>
        <button className="cta">
          <span className="label bold">{strings.ITINERARY.OPEN_MAP_VIEW}</span>
          <div className="icon">
            {ChevronRight({
              fillColor: COLORS.BLACK,
              height: '0.75rem',
              width: '0.75rem',
            })}
          </div>
        </button>
      </div>
      <div className="image-container">
        <Image
          height={52}
          width={52}
          fill
          url={ITINERARY_MAP_BANNER_ICON_IMAGE}
          alt={'map'}
        />
      </div>
      <div className="bg-image-container">
        <Image
          height={76}
          width={123}
          url={ITINERARY_MAP_BANNER_BG_IMAGE}
          alt={'map'}
        />
      </div>
    </StyledItineraryMapViewBanner>
  );
};

export default ItineraryMapViewBanner;
