import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { EItineraryType } from '@headout/espeon/components/ItineraryV2';
import Conditional from 'components/common/Conditional';
import Legend from 'components/common/Itinerary/MapView/Map/Legend';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { TRouteMap } from './interface';
import Overlay from './Overlay';
import { MainContainer, MapContainer } from './styles';

const RouteMap = dynamic(
  () =>
    import('@headout/espeon/components/NewVerticals/RouteMap').then(
      (mod) => mod.RouteMap
    ),
  { ssr: false }
);

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
