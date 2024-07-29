import { useEffect, useMemo, useRef } from 'react';
import { ChildSection } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import MapViewCardButton from 'components/common/Itinerary/MapView/MWebMapView/MapViewCard/components/MapViewCardButton';
import type { TMapViewCardProps } from 'components/common/Itinerary/MapView/MWebMapView/MapViewCard/interface';
import {
  StyledButtonIconContainer,
  StyledMapViewCardContainer,
} from 'components/common/Itinerary/MapView/MWebMapView/MapViewCard/styles';
import { getSubStopsAndPassBys } from 'components/common/Itinerary/MapView/MWebMapView/MapViewCard/utils';
import Descriptors from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import { useItinerary } from 'contexts/ItineraryContext';
import useOnScreen from 'hooks/useOnScreen';
import { generateGoogleMapUrl } from 'utils/itinerary';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { MapSVG } from 'assets/airportTransfers';
import InfoOutlinedIcon from 'assets/InfoOutlinedIcon';

const MapViewCard = ({
  sectionDetails,
  stops,
  descriptors,
  subCards = [],
  isPassBy,
  cardTag: CardTag,
  stopIndex,
  onCardInView,
  itineraryType,
}: TMapViewCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { details, location, id: stopId } = sectionDetails ?? {};
  const { name } = details ?? {};
  const { title, id: passById } = stops?.[0] ?? {};
  const isOnScreen = useOnScreen({
    ref: cardRef,
    options: {
      threshold: 1,
    },
  });

  const {
    setActiveStopIndex,
    setActiveItineraryStopId,
    setIsItineraryDetailsSwipeSheetOpen,
  } = useItinerary();

  const { subStopsAndPassBys } = useMemo(() => {
    return getSubStopsAndPassBys(subCards, itineraryType);
  }, []);

  useEffect(() => {
    if (isOnScreen && cardRef.current) {
      onCardInView?.(
        isPassBy ? (stops?.[0]! as ChildSection) : sectionDetails!
      );
    }
  }, [isOnScreen, cardRef]);

  const getCTAs = () => {
    const ctas: JSX.Element[] = [getCTAConfig('details')];

    if (location) {
      ctas.push(
        getCTAConfig('directions', ctas.length ? 'secondary' : 'primary')
      );
    }

    return ctas;
  };

  const handleViewDetailsClick = () => {
    setActiveItineraryStopId(isPassBy ? passById! : stopId!);
    setActiveStopIndex(stopIndex);
    setIsItineraryDetailsSwipeSheetOpen(true);
  };

  const handleViewDirectionsClick = () => {
    const url = generateGoogleMapUrl(location!);

    window.open(url);
  };

  const getCTAConfig = (
    type: 'details' | 'directions',
    buttonType: 'primary' | 'secondary' = 'primary'
  ) => {
    switch (type) {
      case 'details': {
        const Icon = () => {
          return (
            <StyledButtonIconContainer>
              <InfoOutlinedIcon />
            </StyledButtonIconContainer>
          );
        };

        return (
          <MapViewCardButton
            key={'view-details'}
            type={buttonType}
            label={'View Details'}
            icon={<Icon />}
            onClick={handleViewDetailsClick}
          />
        );
      }

      case 'directions': {
        const Icon = () => {
          return (
            <StyledButtonIconContainer
              $svgPathColor={
                buttonType === 'secondary'
                  ? COLORS.BRAND.PURPS
                  : COLORS.BRAND.WHITE
              }
            >
              <MapSVG />
            </StyledButtonIconContainer>
          );
        };

        return (
          <MapViewCardButton
            key={'view-directions'}
            type={buttonType}
            label={'Directions'}
            icon={<Icon />}
            onClick={handleViewDirectionsClick}
          />
        );
      }

      default: {
        return <></>;
      }
    }
  };

  const getSubCardsString = () => {
    return subStopsAndPassBys
      .map((item) => item.subSectionDetails?.details.name)
      .join(', ');
  };

  return (
    <StyledMapViewCardContainer
      ref={cardRef}
      id={`map-view-card-${isPassBy ? passById : stopId}`}
    >
      {CardTag && <div className="tag-container">{CardTag}</div>}
      <h6 className="heading">{isPassBy ? title : name}</h6>
      <Descriptors
        {...descriptors}
        variant={TimelineViewComponentVariant.REDUCED_WIDTH}
      />
      <div className="cta-container">{getCTAs()}</div>
      <Conditional if={subStopsAndPassBys?.length}>
        <div className="nearby-things-container">
          <p className="nearby-things-heading">
            {subStopsAndPassBys.length}{' '}
            {strings.ITINERARY.SUB_SECTION_HEADING.NEARBY_THINGS_TO_DO.toLowerCase()}
            :
          </p>
          <div className="nearby-things-value-container">
            <p className="nearby-things-value">{getSubCardsString()}</p>
          </div>
        </div>
      </Conditional>
    </StyledMapViewCardContainer>
  );
};

export default MapViewCard;
