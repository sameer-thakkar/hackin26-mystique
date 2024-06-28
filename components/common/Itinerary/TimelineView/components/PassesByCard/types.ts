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
  }[];
  variant?: TimelineViewComponentVariant;
};

export type PassesBySubCardProps = PassesByCardProps['stops'][0] & {
  variant?: TimelineViewComponentVariant;
  itineraryId: number;
  onClick?: TOnStopClick;
};
