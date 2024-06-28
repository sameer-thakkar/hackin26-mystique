import { ChildSection, Section } from 'types/itinerary.type';
import { Props as DescriptorProps } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/types';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';

export type TSubStopCardProps = {
  subSectionDetails: Partial<ChildSection | Section>;
  sectionDetails?: Omit<Section, 'childSections'>;
  descriptors?: DescriptorProps;
  variant?: TimelineViewComponentVariant;
  isHOHOItinerary?: boolean;
  itineraryId: number;
};
