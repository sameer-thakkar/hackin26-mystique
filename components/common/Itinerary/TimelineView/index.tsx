import { useEffect, useMemo, useRef, useState } from 'react';
import { Section } from 'types/itinerary.type';
import PassesByCard from 'components/common/Itinerary/TimelineView/components/PassesByCard';
import StopCard from 'components/common/Itinerary/TimelineView/components/StopCard';
import type { TTimelineViewComponentProps } from 'components/common/Itinerary/TimelineView/interface';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { sectionDataSanitizer } from 'utils/itinerary';
import { ANALYTICS_EVENTS } from 'const/index';

const TimelineView = ({ itinerary }: TTimelineViewComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [eventRecorded, setEventRecorded] = useState(false);
  const isOnScreen = useOnScreen({ ref, unobserve: eventRecorded });

  const stopCardProps = useMemo(
    () => sectionDataSanitizer(itinerary.sections as Section[], itinerary.type),
    [itinerary]
  );

  useEffect(() => {
    if (eventRecorded || !isOnScreen) return;
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY.TIMELINE_VIEWED,
    });
    setEventRecorded(true);
  }, [eventRecorded, isOnScreen]);

  return (
    <div>
      {stopCardProps.map(({ stop, passby }) =>
        passby ? (
          <PassesByCard
            {...passby}
            key={`passby-card-${passby.stops[0]!.id}`}
          />
        ) : (
          <StopCard {...stop} key={`stop-card-${stop!.sectionDetails?.id}`} />
        )
      )}
    </div>
  );
};

export default TimelineView;
