import { ChildSection } from 'types/itinerary.type';
import {
  TimelineViewComponentVariant,
  TOnStopClick,
} from 'components/common/Itinerary/TimelineView/interface';

export type NearbyThingsToDoProps = {
  passBys?: ChildSection[];
  variant?: TimelineViewComponentVariant;
  itineraryId: number;
  onClick?: TOnStopClick;
};
