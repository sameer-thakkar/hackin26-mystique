import type { ChildSection } from 'types/itinerary.type';
import type { StopCardProps } from './types';

export const getSubStopsAndPassBys = (
  subCards: Omit<StopCardProps, 'position' | 'subCards' | 'multiPointDetails'>[]
) => {
  const subStops = subCards.filter(({ subSectionDetails, isSubSection }) =>
    isSubSection ? subSectionDetails && !subSectionDetails.details.passBy : true
  );
  const passBys = subCards
    .filter(
      ({ subSectionDetails }) =>
        subSectionDetails && subSectionDetails.details.passBy
    )
    .map(({ subSectionDetails }) => subSectionDetails) as ChildSection[];
  return { subStops, passBys };
};
