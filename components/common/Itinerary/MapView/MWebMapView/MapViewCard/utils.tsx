import type { ItineraryType } from 'types/itinerary.type';
import { type StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';
import { isHOHOItinerary } from 'utils/itinerary';

export const getSubStopsAndPassBys = (
  subCards: Omit<
    StopCardProps,
    'subCards' | 'position' | 'multiPointDetails'
  >[],
  itineraryType: ItineraryType
) => {
  let subStopsAndPassBys =
    subCards.filter(({ isSubSection, subSectionDetails }) => {
      if (isHOHOItinerary(itineraryType)) {
        return isSubSection && subSectionDetails?.details.passBy;
      }

      return isSubSection && !subSectionDetails?.details.passBy;
    }) ?? [];

  if (!isHOHOItinerary(itineraryType) && !subStopsAndPassBys.length) {
    subStopsAndPassBys = subCards.filter(
      ({ isSubSection, subSectionDetails }) =>
        isSubSection && subSectionDetails?.details.passBy
    );
  }

  return { subStopsAndPassBys };
};
