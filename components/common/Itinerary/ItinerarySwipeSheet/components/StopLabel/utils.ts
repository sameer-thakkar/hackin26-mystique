import { SECTION_TYPE } from 'types/itinerary.type';
import type { TStopLabelProps } from 'components/common/Itinerary/ItinerarySwipeSheet/components/StopLabel/interface';
import { strings } from 'const/strings';

export const getStopLabelText = ({
  stopCardProps,
  currentStop,
}: TStopLabelProps) => {
  const { stop, passby } = stopCardProps[currentStop];
  if (!stop && !passby) return '';

  if (passby) return strings.ITINERARY.STOP_CARD.TITLE.PASSING_BY;

  const { position, sectionDetails } = stop!;
  if (position !== undefined && sectionDetails) {
    const { type } = sectionDetails;

    switch (type) {
      case SECTION_TYPE.START_LOCATION:
        return strings.ITINERARY.STOP_CARD.TITLE.STARTING_POINT;
      case SECTION_TYPE.STOP:
        return `${strings.ITINERARY.STOP_CARD.TITLE.STOP} ${position}`;
      case SECTION_TYPE.END_LOCATION:
        return strings.ITINERARY.STOP_CARD.TITLE.ENDING_POINT;
      default:
        return '';
    }
  }
};
