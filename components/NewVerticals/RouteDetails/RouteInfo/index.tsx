import { useContext, useEffect } from 'react';
import { Itinerary, SECTION_TYPE } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { SECTION_NAMES } from 'components/HOHO/constants';
import AttractionsCarousel from 'components/NewVerticals/AttractionsCarousel';
import { MBContext } from 'contexts/MBContext';
import { genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import {
  generateGoogleMapUrl,
  getItineraryDuration,
  getItineraryTiming,
  isCruiseItinerary,
} from 'utils/itinerary';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PRODUCT_CARD_REVAMP,
} from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import { LegendMarker } from 'assets/legendMarker';
import BoardingPoints from '../BoardingPoint';
import BoardingPointItem from '../BoardingPoint/BoardingPointItem';
import HOHORouteMap from '../RouteMap';
import RoutesTimeline from '../RoutesTimeline';
import { TRouteInfo } from './interface';
import {
  Container,
  DetailsWrapper,
  ExpandableSectionWrapper,
  Subtext,
  TimelineWrapper,
  Title,
} from './styles';

const RouteInfo = (props: TRouteInfo) => {
  const {
    tgid,
    openRoutesTimeline,
    showRoutesTimeline,
    isSideModalOpen,
    isMobile,
    routeData,
    isDescriptorClick,
    isCruise,
  } = props;
  const { lang } = useContext(MBContext);

  const totalStops = routeData?.sections?.filter(
    (stop: Record<string, any>) =>
      stop?.type !== 'START_LOCATION' && stop.type !== 'END_LOCATION'
  )?.length;
  const {
    name,
    type,
    details: {
      routeName = '',
      frequency = 0,
      firstDepartureTime = '',
      lastDepartureTime = '',
      duration,
    },
    sections: routeSectionsData = [],
    map: routeMapData,
  } = routeData || {};

  const timing = getItineraryTiming({ firstDepartureTime, lastDepartureTime });
  const stringConnector =
    firstDepartureTime && lastDepartureTime && frequency ? '|' : '';
  const finalDuration = getItineraryDuration({ duration, lang });
  const boardingPoints = routeSectionsData?.reduce((acc: string[], stop) => {
    if (stop?.type === SECTION_TYPE.START_LOCATION) {
      acc.push(stop?.details?.name || '');
    }
    return acc;
  }, []);

  useEffect(() => {
    if (!showRoutesTimeline) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.ITINERARY_POPUP_VIEWED,
        [ANALYTICS_PROPERTIES.ITINERARY_TYPE]: isCruise
          ? en.CRUISES.SIGHTS_COVERED
          : en.HOHO.ROUTES,
        [ANALYTICS_PROPERTIES.PLACEMENT]: isDescriptorClick
          ? PRODUCT_CARD_REVAMP.PLACEMENT.DESCRIPTORS
          : PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD,
        [ANALYTICS_PROPERTIES.TGID]: tgid,
        ...(isCruise && {
          [ANALYTICS_PROPERTIES.BOARDING_POINTS]: boardingPoints?.join(', '),
        }),
      });
    }
  }, []);

  const {
    details: { name: firstStopName = '' },
    location,
  } = routeSectionsData?.[0];
  const { latitude = 0, longitude = 0, placeId = '' } = location || {};
  const isCruiseType = isCruiseItinerary(type);

  const ExpandableSection = () => (
    <>
      <Conditional
        if={(isCruiseType && boardingPoints?.length > 1) || !isCruiseType}
      >
        <ExpandableSectionWrapper
          onClick={openRoutesTimeline}
          $isCruiseVariant={isCruise}
        >
          <Conditional if={isCruiseType}>
            <div className="icon-text-wrapper">
              <LegendMarker className="location-pin" />
              <div>
                <Title $isBoardingPoint={true}>
                  {strings.formatString(
                    strings.CRUISES.X_BOARDING_POINTS,
                    boardingPoints?.length
                  )}
                </Title>
                <Subtext $isBoardingPoint={true}>
                  {boardingPoints?.join(', ')}
                </Subtext>
              </div>
            </div>
          </Conditional>
          <Conditional if={!isCruiseType}>
            <div>
              <Title>{strings.HOHO.STOPS_AND_ATTRACTIONS}</Title>
              <Subtext>
                {strings.formatString(strings.HOHO.HOP_ON_OFF_AT, totalStops)}
              </Subtext>
            </div>
          </Conditional>
          <ChevronRight
            fillColor={COLORS.GRAY.G2}
            strokeWidth={1}
            className="chevron"
          />
        </ExpandableSectionWrapper>
      </Conditional>
      <Conditional
        if={isCruise && isCruiseType && boardingPoints?.length === 1}
      >
        <BoardingPointItem
          stopNumber={1}
          stopName={firstStopName}
          stopLocation={generateGoogleMapUrl({
            latitude,
            longitude,
            placeId,
          })}
        />
      </Conditional>
    </>
  );

  const TimingsSection = () => (
    <div className="timings-section">
      <Conditional if={frequency}>
        <div className="frequency">
          <Title>{strings.HOHO.TIMINGS_FREQUENCY}</Title>
          <Subtext>
            {`${timing} ${stringConnector} ${strings.formatString(
              strings.HOHO.EVERY_X_MINS,
              frequency
            )}`}
          </Subtext>
        </div>
      </Conditional>
      <Conditional if={finalDuration}>
        <div className="duration">
          <Title>{strings.HOHO.TOUR_DURATION}</Title>
          <Subtext>{finalDuration}</Subtext>
        </div>
      </Conditional>
    </div>
  );

  let sectionName = SECTION_NAMES.ITINERARY_DETAILS;
  if (showRoutesTimeline) {
    if (isCruise) sectionName = en.CRUISES.BOARDING_POINTS;
    else SECTION_NAMES.NEARBY_ATTRACTIONS;
  }
  const MapSection = () => (
    <HOHORouteMap
      routeMapData={routeMapData}
      showRoutesTimeline={showRoutesTimeline}
      isSideModalOpen={isSideModalOpen}
      routeName={routeName}
      itinerary={routeData as Itinerary}
      showLegend={isCruise}
      isOnTop={isCruise}
      showOverlay={isMobile}
      sectionName={sectionName}
    />
  );

  const AttractionCarouselSection = () => (
    <AttractionsCarousel
      isMobile={isMobile}
      routeSectionsData={routeSectionsData}
      index={name}
      key={routeName}
      hideStopName={isCruise}
      excludeStopAsAttraction={isCruise && !isCruiseType}
    />
  );

  let ELEMENTS_ORDER = isMobile
    ? [ExpandableSection, TimingsSection, MapSection, AttractionCarouselSection]
    : [ExpandableSection, TimingsSection, AttractionCarouselSection];
  if (isCruise) {
    ELEMENTS_ORDER = isMobile
      ? [
          MapSection,
          ExpandableSection,
          AttractionCarouselSection,
          TimingsSection,
        ]
      : [ExpandableSection, AttractionCarouselSection, TimingsSection];
  }

  return (
    <Container $isTimelineModal={showRoutesTimeline}>
      <Conditional if={!showRoutesTimeline}>
        <DetailsWrapper $isCruiseVariant={isCruise}>
          {ELEMENTS_ORDER?.map((Component) => (
            <Component key={genUniqueId()} />
          ))}
        </DetailsWrapper>
      </Conditional>
      <Conditional if={showRoutesTimeline}>
        <TimelineWrapper>
          <Conditional if={isCruiseType}>
            <BoardingPoints sectionsData={routeSectionsData} />
          </Conditional>
          <Conditional if={!isCruiseType}>
            <RoutesTimeline
              routeSectionsData={routeSectionsData}
              routeName={routeName}
            />
          </Conditional>
        </TimelineWrapper>
      </Conditional>
      <Conditional if={!isMobile}>
        <MapSection />
      </Conditional>
    </Container>
  );
};
export default RouteInfo;
