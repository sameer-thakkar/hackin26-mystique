import { useEffect } from 'react';
import RouteMap from 'components/common/Itinerary/MapView/Map';
import {
  TOnClickTrackEvent,
  TOnZoomTrackEvent,
} from 'components/common/Itinerary/MapView/Map/interface';
import { SECTION_NAMES } from 'components/HOHO/constants';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { TRouteMap } from './interface';
import { MapContainer } from './styles';

const HOHORouteMap = (props: TRouteMap) => {
  const {
    routeMapData,
    showRoutesTimeline,
    routeName,
    isSideModalOpen,
    itinerary,
  } = props;

  const { itineraryRoute: { polyline = '' } = {} } = routeMapData || {};

  const SECTION_NAME = showRoutesTimeline
    ? SECTION_NAMES.NEARBY_ATTRACTIONS
    : SECTION_NAMES.ITINERARY_DETAILS;

  useEffect(() => {
    if (!showRoutesTimeline || (showRoutesTimeline && isSideModalOpen))
      trackEvent({
        eventName: ANALYTICS_EVENTS.MAP_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
        [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
      });
  }, [routeName, showRoutesTimeline, isSideModalOpen]);

  const handleClickEvent = ({
    type,
    stopName,
    stopNumber,
  }: TOnClickTrackEvent) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MAP_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
      [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
      [ANALYTICS_PROPERTIES.CLICK_TYPE]: type,
      [ANALYTICS_PROPERTIES.STOP_NAME]: stopName,
      [ANALYTICS_PROPERTIES.STOP_NUMBER]: stopNumber,
    });
  };

  const handleZoomEvent = ({ zoomType }: TOnZoomTrackEvent) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MAP_ZOOMED,
      [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
      [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
      [ANALYTICS_PROPERTIES.ZOOM_TYPE]: zoomType,
    });
  };

  if (!polyline) return <MapContainer $isTimelineModal={showRoutesTimeline} />;
  return (
    <MapContainer $isTimelineModal={showRoutesTimeline} key={polyline}>
      <RouteMap
        itinerary={itinerary}
        onClickTrackEvent={handleClickEvent}
        onZoomTrackEvent={handleZoomEvent}
      />
    </MapContainer>
  );
};

export default HOHORouteMap;
