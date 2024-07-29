import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Section } from 'types/itinerary.type';
import PassesByCard from 'components/common/Itinerary/TimelineView/components/PassesByCard';
import StopCard from 'components/common/Itinerary/TimelineView/components/StopCard';
import type {
  TOnStopClick,
  TTimelineViewComponentProps,
} from 'components/common/Itinerary/TimelineView/interface';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import { StyledTimelineViewContainer } from 'components/common/Itinerary/TimelineView/styles';
import { useItinerary } from 'contexts/ItineraryContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  isCruiseItinerary as checkIfCruiseItinerary,
  isHOHOItinerary as checkIfHOHOItinerary,
  sectionDataSanitizer,
} from 'utils/itinerary';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_EVENTS } from 'const/index';

const TimelineView = ({
  itinerary,
  variant = TimelineViewComponentVariant.DEFAULT,
  onStopSectionClick,
}: TTimelineViewComponentProps) => {
  const { isMobile } = useRecoilValue(appAtom);
  const isDesktop = !isMobile;
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [eventRecorded, setEventRecorded] = useState(false);
  const isOnScreen = useOnScreen({ ref: timelineContainerRef });
  const {
    activeItineraryStopId,
    setActiveItineraryStopId,
    setActiveStopIndex,
    setIsItineraryDetailsSwipeSheetOpen,
  } = useItinerary();

  const stopCardProps = useMemo(
    () => sectionDataSanitizer(itinerary.sections as Section[], itinerary.type),
    [itinerary]
  );

  useEffect(() => {
    if (eventRecorded || !isOnScreen) return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY.TIMELINE_VIEWED,
      variant,
    });
    setEventRecorded(true);
  }, [eventRecorded, isOnScreen]);

  const handleStopSectionClick: TOnStopClick = (sectionDetails, stopIndex) => {
    setActiveItineraryStopId(sectionDetails.id);
    if (stopIndex !== undefined) setActiveStopIndex(stopIndex);
    onStopSectionClick?.(sectionDetails);

    if (!isDesktop) {
      setIsItineraryDetailsSwipeSheetOpen(true);
    }
  };

  const isReducedWidthVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;
  const isHOHOItinerary = checkIfHOHOItinerary(itinerary.type);
  const isCruiseItinerary = checkIfCruiseItinerary(itinerary.type);

  return (
    <StyledTimelineViewContainer $variant={variant} ref={timelineContainerRef}>
      {stopCardProps.map(({ stop, passby }, stopIndex) =>
        passby ? (
          <PassesByCard
            {...passby}
            key={`passby-card-${passby.stops?.[0]?.id}`}
            variant={variant}
            itineraryId={itinerary.id}
            isCruiseItinerary={isCruiseItinerary}
            onStopSectionClick={(sectionDetails) =>
              handleStopSectionClick(sectionDetails, stopIndex)
            }
          />
        ) : (
          <StopCard
            {...stop}
            key={`stop-card-${stop!.sectionDetails?.id}`}
            variant={variant}
            onStopSectionClick={(sectionDetails) =>
              handleStopSectionClick(sectionDetails, stopIndex)
            }
            isActive={
              isReducedWidthVariant &&
              stop!.sectionDetails?.id === activeItineraryStopId
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
