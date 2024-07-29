import { SECTION_TYPE } from 'types/itinerary.type';
import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';

export const isStartOrEndLocation = (stopType: SECTION_TYPE) =>
  stopType === SECTION_TYPE.START_LOCATION ||
  stopType === SECTION_TYPE.END_LOCATION;

export const getStartOrEndPoints = (stop: StopCardProps) => {
  if (
    !stop.sectionDetails?.type ||
    !isStartOrEndLocation(stop.sectionDetails?.type)
  )
    return [];
  const pointsFromSubCards = stop.subCards?.filter(
    ({ sectionDetails }) =>
      sectionDetails?.type && isStartOrEndLocation(sectionDetails.type)
  );
  return pointsFromSubCards?.length ? pointsFromSubCards : [stop];
};
