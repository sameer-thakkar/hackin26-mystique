import { ChildSection, Section } from 'types/itinerary.type';
import { Props as DescriptorProps } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/types';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';

export type StopCardProps = {
  sectionDetails?: Omit<Section, 'childSections'>;
  subSectionDetails?: ChildSection | Section;
  descriptors?: DescriptorProps;
  onStateChange?: (isOpen?: boolean) => void;
  defaultOpen?: boolean;
  subCards?: Omit<
    StopCardProps,
    'subCards' | 'multiPointDetails' | 'position'
  >[];
  isSubCard?: boolean;
  position?: number;
  isSubSection?: boolean;
  isForcedStart?: boolean;
  isForcedEnd?: boolean;
  variant?: TimelineViewComponentVariant;
  onStopSectionClick?: (
    sectionDetails: Omit<Section, 'childSections'> | Section | ChildSection
  ) => void;
  isActive?: boolean;
  isHOHOItinerary?: boolean;
  findDirections?: boolean;
  hasMultipleSubStops?: boolean;
};
