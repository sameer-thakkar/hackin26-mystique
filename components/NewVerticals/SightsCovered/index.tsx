import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { Itinerary } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import TabWrapper from 'components/slices/TabWrapper';
import { MBContext } from 'contexts/MBContext';
import {
  getItineraryDuration,
  getItineraryTiming,
  isCruiseItinerary,
} from 'utils/itinerary';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PRODUCT_CARD_REVAMP,
} from 'const/index';
import { strings } from 'const/strings';
import AttractionsCarousel from '../AttractionsCarousel';
import BoardingPoints from '../RouteDetails/BoardingPoint';
import { Subtext, Title } from '../RouteDetails/RouteInfo/styles';
import HOHORouteMap from '../RouteDetails/RouteMap';
import { Container, Wrapper } from './styles';

const SightsCovered = ({ itineraryData }: { itineraryData: Itinerary[] }) => {
  const { isMobile } = useRecoilValue(appAtom);
  const { lang } = useContext(MBContext);

  const tabsArray = itineraryData?.map((itinerary, index: number) => {
    const {
      details: {
        routeName = '',
        frequency = 0,
        firstDepartureTime = '',
        lastDepartureTime = '',
        duration,
      },
      sections,
      id: itineraryId,
      name: itineraryName,
      type,
      map: routeMapData,
    } = itinerary || {};

    const timing = getItineraryTiming({
      firstDepartureTime,
      lastDepartureTime,
    });
    const stringConnector =
      firstDepartureTime && lastDepartureTime && frequency ? '|' : '';
    const finalDuration = getItineraryDuration({ duration, lang });

    return {
      children: (
        <Container>
          <AttractionsCarousel
            isMobile={isMobile}
            routeSectionsData={sections}
            index={itineraryName}
            isSightsCovered={true}
            hideStopName={true}
            excludeStopAsAttraction={!isCruiseItinerary(type)}
          />
          <Conditional if={sections?.length}>
            <HOHORouteMap
              itinerary={itineraryData?.[0]}
              routeMapData={routeMapData}
              routeName={routeName}
              showLegend={true}
              isOnTop={true}
              showOverlay={true}
              sectionName={PRODUCT_CARD_REVAMP.PLACEMENT.MORE_DETAILS}
            />
          </Conditional>
          <BoardingPoints sectionsData={sections} />

          <Conditional if={frequency}>
            <div
              className={classNames('frequency', finalDuration && 'bordered')}
            >
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
        </Container>
      ),
      heading: routeName || itineraryName,
      trackingObject: {
        eventName: ANALYTICS_EVENTS.ITINERARY_VARIANT_CLICKED,
        [ANALYTICS_PROPERTIES.ITINERARY_ID]: itineraryId,
        [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName || itineraryName,
        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      },
    };
  });

  return (
    <>
      <h6 className="sights-covered-heading">
        {strings.CRUISES.SIGHTS_COVERED}
      </h6>
      <Wrapper $noTabs={itineraryData?.length < 2}>
        <TabWrapper
          tabElements={tabsArray}
          renderTabElements={true}
          showControls={true}
        />
      </Wrapper>
    </>
  );
};

export default SightsCovered;
