import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { SECTION_NAMES } from 'components/HOHO/constants';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { TRouteMap } from './interface';
import { MapContainer } from './styles';
import { getLeafletMapMarkers } from './utils';

const LeafletMap = dynamic(
  () => import('@headout/aer/src/molecules/LeafletMap'),
  {
    ssr: false,
  }
);

const RouteMap = (props: TRouteMap) => {
  const {
    routeSectionsData,
    routeMapData,
    showRoutesTimeline,
    isMobile,
    routeName,
    isSideModalOpen,
  } = props;

  const {
    itineraryRoute: { polyline = '', polylineColor = COLORS.BRAND.PURPS } = {},
  } = routeMapData || {};

  const SECTION_NAME = showRoutesTimeline
    ? SECTION_NAMES.NEARBY_ATTRACTIONS
    : SECTION_NAMES.ITINERARY_DETAILS;

  const markers = useMemo(
    () =>
      getLeafletMapMarkers({
        itinerary: routeSectionsData,
        sectionName: SECTION_NAME,
        itineraryName: routeName,
      }),
    [routeSectionsData]
  );

  useEffect(() => {
    if (!showRoutesTimeline || (showRoutesTimeline && isSideModalOpen))
      trackEvent({
        eventName: ANALYTICS_EVENTS.MAP_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
        [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName,
      });
  }, [routeName, showRoutesTimeline, isSideModalOpen]);

  if (!polyline) return <MapContainer $isTimelineModal={showRoutesTimeline} />;
  return (
    <MapContainer $isTimelineModal={showRoutesTimeline} key={polyline}>
      <LeafletMap
        lines={[
          {
            path: polyline,
            options: {
              color: polylineColor,
              lineJoin: 'round',
            },
          },
        ]}
        markers={markers}
        minZoomLevel={isMobile ? 8 : 10}
        maxZoomLevel={18}
        showZoomControls={true}
        mapTiles={
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        }
      />
    </MapContainer>
  );
};

export default RouteMap;
