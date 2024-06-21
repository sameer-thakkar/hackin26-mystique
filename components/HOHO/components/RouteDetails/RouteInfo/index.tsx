import { useContext, useEffect, useRef, useState } from 'react';
import { Itinerary } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { throttle } from 'utils/gen';
import { getScrollPercentage } from 'utils/helper';
import { convertTo12HrFormat, formatDurationToString } from 'utils/timeUtils';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, THRESHOLD } from 'const/index';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import AttractionsCarousel from '../../AttractionsCarousel';
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
    openRoutesTimeline,
    showRoutesTimeline,
    isSideModalOpen,
    isMobile,
    routeData,
    setIsHeaderSticky = () => {},
  } = props;
  const { lang } = useContext(MBContext);

  const totalStops = routeData?.sections?.filter(
    (stop: Record<string, any>) =>
      stop?.type !== 'START_LOCATION' && stop.type !== 'END_LOCATION'
  )?.length;
  const {
    name,
    details: {
      routeName = '',
      frequency = 0,
      firstDepartureTime = '',
      lastDepartureTime = '',
      duration = {},
    } = {},
    sections: routeSectionsData = {},
    map: routeMapData = {},
  } = routeData || {};
  const startTime = convertTo12HrFormat(firstDepartureTime);
  const endTime = convertTo12HrFormat(lastDepartureTime);
  const timing = `${startTime} - ${endTime}`;
  const stringConnector = startTime && endTime && frequency ? '|' : '';
  const { hours, minutes } = duration || {};
  const finalDuration = formatDurationToString({
    hour: hours,
    minute: minutes,
    lang,
  });

  type ScrollStateT = {
    triggered: Record<number, boolean>;
  };

  const scrollRef = useRef(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [scrollDetails, setScrollDetails] = useState<ScrollStateT>({
    triggered: {
      25: false,
      50: false,
      75: false,
      90: false,
    },
  });

  const triggerEvent = (percentage: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.STOPS_SCROLLED,
      [ANALYTICS_PROPERTIES.PERCENTAGE_VIEWED]: percentage,
    });
  };
  useEffect(() => {
    const scrollThreshold = getScrollPercentage(scrollPercentage);
    const triggered: ScrollStateT['triggered'] = {
      ...scrollDetails['triggered'],
    };

    if (scrollThreshold !== null) {
      THRESHOLD.forEach((threshold) => {
        if (scrollThreshold >= threshold && !triggered[threshold]) {
          triggerEvent(threshold);
          triggered[threshold] = true;
        }
      });
      setScrollDetails({ triggered });
    }
  }, [scrollPercentage]);

  const getScrollPercent = () => {
    if (scrollRef?.current) {
      const {
        scrollTop = 0,
        scrollHeight = 0,
        clientHeight = 0,
      } = scrollRef.current;
      const isHeaderSticky = scrollTop >= 24;
      setIsHeaderSticky(isHeaderSticky);

      const percentageScrolled =
        (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollPercentage(percentageScrolled);
    }
  };
  const throttledScrollHandler = throttle(getScrollPercent, 200);

  return (
    <Container $isTimelineModal={showRoutesTimeline}>
      <Conditional if={!showRoutesTimeline}>
        <DetailsWrapper>
          <ExpandableSectionWrapper onClick={openRoutesTimeline}>
            <div>
              <Title>{strings.HOHO.STOPS_AND_ATTRACTIONS}</Title>
              <Subtext>
                {strings.formatString(strings.HOHO.HOP_ON_OFF_AT, totalStops)}
              </Subtext>
            </div>
            <ChevronRight fillColor={COLORS.GRAY.G2} strokeWidth={1} />
          </ExpandableSectionWrapper>
          <div>
            <Title>{strings.HOHO.TIMINGS_FREQUENCY}</Title>
            <Subtext>
              {`${timing} ${stringConnector} ${strings.formatString(
                strings.HOHO.EVERY_X_MINS,
                frequency
              )}`}
            </Subtext>
          </div>
          <Conditional if={finalDuration}>
            <div>
              <Title>{strings.HOHO.TOUR_DURATION}</Title>
              <Subtext>{finalDuration}</Subtext>
            </div>
          </Conditional>
          <Conditional if={isMobile}>
            <HOHORouteMap
              routeMapData={routeMapData}
              showRoutesTimeline={showRoutesTimeline}
              isSideModalOpen={isSideModalOpen}
              routeName={routeName}
              itinerary={routeData as Itinerary}
            />
          </Conditional>
          <AttractionsCarousel
            isMobile={isMobile}
            routeSectionsData={routeSectionsData}
            index={name}
            key={routeName}
          />
        </DetailsWrapper>
      </Conditional>
      <Conditional if={showRoutesTimeline}>
        <TimelineWrapper ref={scrollRef} onScroll={throttledScrollHandler}>
          <RoutesTimeline
            routeSectionsData={routeSectionsData}
            routeName={routeName}
          />
        </TimelineWrapper>
      </Conditional>
      <Conditional if={!isMobile}>
        <HOHORouteMap
          routeMapData={routeMapData}
          showRoutesTimeline={showRoutesTimeline}
          isSideModalOpen={isSideModalOpen}
          routeName={routeName}
          itinerary={routeData as Itinerary}
        />
      </Conditional>
    </Container>
  );
};
export default RouteInfo;
