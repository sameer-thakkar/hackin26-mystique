import type { THighlights, TNearbyThings } from 'types/itinerary.type';
import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';

export const getNearByThingsAndHighlights = (
  subCards: Omit<StopCardProps, 'subCards' | 'position' | 'multiPointDetails'>[]
): {
  highlights: THighlights[];
  nearbyThings: TNearbyThings[];
} => {
  const subSectionCards = subCards.filter(
    ({ isSubSection, subSectionDetails }) => {
      return isSubSection && subSectionDetails?.location;
    }
  );

  const highlights = subSectionCards.filter(({ subSectionDetails }) => {
    return !subSectionDetails?.details.passBy;
  }) as THighlights[];

  const nearbyThings = subSectionCards.filter(({ subSectionDetails }) => {
    return subSectionDetails?.details.passBy;
  }) as TNearbyThings[];

  return {
    highlights,
    nearbyThings,
  };
};
