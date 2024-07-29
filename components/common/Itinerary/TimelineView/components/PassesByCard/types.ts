import {
  CHILD_SECTION_TYPE,
  LabelWithLocalization,
  SECTION_TYPE,
  SUB_TYPES,
} from 'types/itinerary.type';
import {
  TimelineViewComponentVariant,
  TOnStopClick,
} from 'components/common/Itinerary/TimelineView/interface';

export type PassesByCardProps = {
  stops: {
    id?: number;
    title?: string;
    image?: string;
    description?: string;
    link?: string | null;
    type?: SECTION_TYPE | CHILD_SECTION_TYPE;
    subType?: LabelWithLocalization<SUB_TYPES>;
  }[];
  isCruiseItinerary?: boolean;
  variant?: TimelineViewComponentVariant;
};

export type PassesBySubCardProps = PassesByCardProps['stops'][0] & {
  variant?: TimelineViewComponentVariant;
  itineraryId: number;
  onClick?: TOnStopClick;
};
