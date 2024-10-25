import type { ChildSection, Section } from 'types/itinerary.type';
import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';

export type TNearbyThingsCardProps = {
  subStopsAndPassBy: Omit<
    StopCardProps,
    'subCards' | 'position' | 'multiPointDetails' | 'subSectionDetails'
  > & {
    subSectionDetails: ChildSection | Section;
  };
  isSelected?: boolean;
  onCardClick?: (id: number) => void;
};
