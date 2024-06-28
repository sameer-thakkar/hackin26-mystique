import { useEffect, useMemo, useRef, useState } from 'react';
import { Section } from 'types/itinerary.type';
import PassesByCard from 'components/common/Itinerary/TimelineView/components/PassesByCard';
import StopCard from 'components/common/Itinerary/TimelineView/components/StopCard';
import type {
  TOnStopClick,
  TTimelineViewComponentProps,
} from 'components/common/Itinerary/TimelineView/interface';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import { StyledTimelineViewContainer } from 'components/common/Itinerary/TimelineView/styles';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  isHOHOItinerary as checkIfHOHOItinerary,
  sectionDataSanitizer,
} from 'utils/itinerary';
import { ANALYTICS_EVENTS } from 'const/index';

const TimelineView = ({
  itinerary,
  variant = TimelineViewComponentVariant.DEFAULT,
  onStopSectionClick,
  activeStopSectionId: activeStopSectionIdFromProps,
}: TTimelineViewComponentProps) => {
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [eventRecorded, setEventRecorded] = useState(false);
  const isOnScreen = useOnScreen({ ref: timelineContainerRef });
  const [activeStopSectionId, setActiveStopSectionId] = useState<
    number | null | undefined
  >(activeStopSectionIdFromProps);

  const stopCardProps = useMemo(
    () => sectionDataSanitizer(itinerary.sections as Section[], itinerary.type),
    [itinerary]
  );

  const isReducedWidthVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;

  useEffect(() => {
    if (eventRecorded || !isOnScreen) return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY.TIMELINE_VIEWED,
      variant,
    });
    setEventRecorded(true);
  }, [eventRecorded, isOnScreen]);

  useEffect(() => {
    if (activeStopSectionIdFromProps) {
      setActiveStopSectionId(activeStopSectionIdFromProps);
    }
  }, [activeStopSectionIdFromProps]);

  const handleStopSectionClick: TOnStopClick = (sectionDetails) => {
    onStopSectionClick?.(sectionDetails);
  };

  const isHOHOItinerary = checkIfHOHOItinerary(itinerary.type);

  return (
    <StyledTimelineViewContainer $variant={variant} ref={timelineContainerRef}>
      {stopCardProps.map(({ stop, passby }) =>
        passby ? (
          <PassesByCard
            {...passby}
            key={`passby-card-${passby.stops[0]!.id}`}
            variant={variant}
            itineraryId={itinerary.id}
            onStopSectionClick={handleStopSectionClick}
          />
        ) : (
          <StopCard
            {...stop}
            key={`stop-card-${stop!.sectionDetails?.id}`}
            variant={variant}
            onStopSectionClick={handleStopSectionClick}
            isActive={
              isReducedWidthVariant &&
              stop!.sectionDetails?.id === activeStopSectionId
            }
            isHOHOItinerary={isHOHOItinerary}
            itineraryId={itinerary.id}
          />
        )
      )}
    </StyledTimelineViewContainer>
  );
};

export default TimelineView;
