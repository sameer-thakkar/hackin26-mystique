import { useEffect, useRef, useState } from 'react';
import type {
  TOnClickTrackEvent,
  TOnZoomTrackEvent,
} from '@headout/espeon/components/Itinerary';
import { EItineraryType } from '@headout/espeon/components/Itinerary';
import { RouteMap } from '@headout/espeon/components/NewVerticals/RouteMap';
import Conditional from 'components/common/Conditional';
import Legend from 'components/common/Itinerary/MapView/Map/Legend';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { TRouteMap } from './interface';
import Overlay from './Overlay';
import { MainContainer, MapContainer } from './styles';

const HOHORouteMap = (props: TRouteMap) => {
  const {
    routeMapData,
    showRoutesTimeline,
    routeName,
    itinerary,
    showLegend = false,
    isOnTop = false,
    showOverlay = false,
    sectionName = '',
    isSightsCoveredLayout = false,
  } = props;

  const [isEnabled, setIsEnabled] = useState(false);
  const ref = useRef(null);
  const isVisible = useOnScreen({
    ref,
    options: {
      threshold: 0.3,
    },
  });

  useEffect(() => {
    if (!isVisible) {
      setIsEnabled(false);
    }
    if (isVisible) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MAP_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: sectionName,
        [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
      });
    }
  }, [isVisible]);

  const handleInteraction = () => {
    setIsEnabled(true);
  };

  const { itineraryRoute: { polyline = '' } = {} } = routeMapData || {};

  const handleClickEvent = ({
    type,
    stopName,
    stopNumber,
  }: TOnClickTrackEvent) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MAP_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: sectionName,
      [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
      [ANALYTICS_PROPERTIES.CLICK_TYPE]: type,
      [ANALYTICS_PROPERTIES.STOP_NAME]: stopName,
      [ANALYTICS_PROPERTIES.STOP_NUMBER]: stopNumber,
    });
  };

  const handleZoomEvent = ({ zoomType }: TOnZoomTrackEvent) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MAP_ZOOMED,
      [ANALYTICS_PROPERTIES.SECTION]: sectionName,
      [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
      [ANALYTICS_PROPERTIES.ZOOM_TYPE]: zoomType,
    });
  };

  if (!itinerary?.sections?.length)
    return <MapContainer $isTimelineModal={showRoutesTimeline} />;
  return (
    <MainContainer $showLegend={showLegend} $isOnTop={isOnTop} ref={ref}>
      <MapContainer
        $isTimelineModal={showRoutesTimeline}
        $showLegend={showLegend}
        $isOnTop={isOnTop}
        key={polyline}
      >
        <RouteMap
          itinerary={itinerary}
          onClickTrackEvent={handleClickEvent}
          onZoomTrackEvent={handleZoomEvent}
          showStartAsStop={
            itinerary?.type === EItineraryType.Cruise || isSightsCoveredLayout
          }
          strings={strings}
          enableFreeTouchPropagation
        />
        <Conditional if={showOverlay && !isEnabled}>
          <Overlay interactionEnabler={handleInteraction} />
        </Conditional>
      </MapContainer>
      <Conditional if={showLegend}>
        <Legend />
      </Conditional>
    </MainContainer>
  );
};

export default HOHORouteMap;
