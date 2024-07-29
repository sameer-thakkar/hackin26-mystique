import { useMemo } from 'react';
import { SECTION_TYPE } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import {
  getStartOrEndPoints,
  isStartOrEndLocation,
} from 'components/common/Itinerary/ItinerarySwipeSheet/components/StopCard/utils';
import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';
import MultiPointsStopCard from '../MultiPointsStopCard';
import SinglePointStopCard from '../SinglePointStopCard';

const StopCard = ({
  stop,
  isCurrentStop = false,
}: {
  stop: StopCardProps;
  isCurrentStop: boolean;
}) => {
  const { sectionDetails: { type } = {} } = stop;

  const startOrEndPoints = useMemo(() => getStartOrEndPoints(stop), [stop]);

  return (
    <>
      <Conditional if={type === SECTION_TYPE.STOP}>
        <SinglePointStopCard isCurrentStop={isCurrentStop} stop={stop} />
      </Conditional>

      <Conditional
        if={type && isStartOrEndLocation(type) && startOrEndPoints.length}
      >
        <Conditional if={startOrEndPoints.length === 1}>
          <SinglePointStopCard
            isCurrentStop={isCurrentStop}
            stop={startOrEndPoints[0]}
          />
        </Conditional>

        <Conditional if={startOrEndPoints.length > 1}>
          <MultiPointsStopCard
            isCurrentStop={isCurrentStop}
            stops={startOrEndPoints}
          />
        </Conditional>
      </Conditional>
    </>
  );
};

export default StopCard;
