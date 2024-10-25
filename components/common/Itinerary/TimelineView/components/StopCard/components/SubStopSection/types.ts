import type { ChildSection, Section } from 'types/itinerary.type';
import type { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import type { StopCardProps } from '../../types';

export type TSubStopSectionProps = {
  subStops?: Omit<
    StopCardProps,
    'subCards' | 'multiPointDetails' | 'position'
  >[];
  passBys?: ChildSection[];
  variant: TimelineViewComponentVariant;
  isSubCard?: boolean;
  isOpen?: boolean;
  hasMultiPoints?: boolean;
  itineraryId: number;
  handleSubStopSectionClick: (
    sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>
  ) => void;
  isHOHOItinerary?: boolean;
};
