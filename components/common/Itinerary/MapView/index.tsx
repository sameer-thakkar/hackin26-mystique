import { useEffect, useRef, useState } from 'react';
import { scroller } from 'react-scroll';
import { ChildSection, Section } from 'types/itinerary.type';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS } from 'const/index';
import ChevronRight from 'assets/chevronRight';
import TimelineView from '../TimelineView';
import { TimelineViewComponentVariant } from '../TimelineView/interface';
import type { TMapController } from './Map/interface';
import RouteMap from './Map';
import {
  MapContainer,
  MapViewContainer,
  SlideInTimelineViewContainer,
  TimelineViewOpener,
} from './styles';
import type { MapViewProps } from './types';

const MapView = ({ itinerary }: MapViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [eventRecorded, setEventRecorded] = useState(false);
  const isOnScreen = useOnScreen({ ref, unobserve: eventRecorded });
  const [isTimelineViewVisible, setIsTimelineViewVisible] = useState(false);
  const mapController = useRef<TMapController | null>(null);
  const [activeStopSectionId, setActiveStopSectionId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (eventRecorded || !isOnScreen) return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY.MAP_VIEWED,
    });
    setEventRecorded(true);
  }, [eventRecorded, isOnScreen]);

  useEffect(() => {
    mapController.current?.reset();
  }, [itinerary.id, isTimelineViewVisible, !!mapController?.current]);

  const scrollToSection = (id: number) => {
    const containerId = `itinerary-timeline-view-${itinerary.id}-${TimelineViewComponentVariant.REDUCED_WIDTH}`;
    const cardId = `itinerary-card-${itinerary.id}-${id}`;

    scroller.scrollTo(cardId, {
      containerId,
      duration: 600,
      delay: 0,
      smooth: true,
      offset: -100,
    });
  };

  const onMapSelect = (id: number) => {
    setActiveStopSectionId(id);
    scrollToSection(id);
    setIsTimelineViewVisible(true);
  };

  const handleStopSectionClick = (
    sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>
  ) => {
    const isSection = Object.keys(sectionDetails).includes('childSections');
    if (isSection) {
      setActiveStopSectionId(sectionDetails.id);
      scrollToSection(sectionDetails.id);
    }

    mapController.current?.zoomIntoSection?.(
      isSection
        ? { section: sectionDetails as Section }
        : { childSection: sectionDetails as ChildSection }
    );
  };

  return (
    <MapViewContainer key={'map view'} ref={ref}>
      <MapContainer $isTimelineModal={isTimelineViewVisible}>
        <RouteMap
          itinerary={itinerary}
          controller={mapController}
          onActiveSectionChange={onMapSelect}
        />
      </MapContainer>
      <SlideInTimelineViewContainer
        $isHidden={!isTimelineViewVisible}
        id={`itinerary-timeline-view-${itinerary.id}-${TimelineViewComponentVariant.REDUCED_WIDTH}`}
      >
        <TimelineView
          itinerary={itinerary}
          variant={TimelineViewComponentVariant.REDUCED_WIDTH}
          activeStopSectionId={activeStopSectionId}
          onStopSectionClick={handleStopSectionClick}
        />
      </SlideInTimelineViewContainer>

      <TimelineViewOpener
        $isExpanded={isTimelineViewVisible}
        onClick={() => {
          setIsTimelineViewVisible(!isTimelineViewVisible);
        }}
      >
        <ChevronRight className="timeline-icon" />
      </TimelineViewOpener>
    </MapViewContainer>
  );
};

export default MapView;
