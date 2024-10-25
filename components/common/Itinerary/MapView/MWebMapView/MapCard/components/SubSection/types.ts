import type { ChildSection, Section } from 'types/itinerary.type';
import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';

export type TSubSectionProps = {
  heading: string;
  cards: Omit<
    StopCardProps,
    'subCards' | 'position' | 'multiPointDetails' | 'subSectionDetails'
  > &
    {
      subSectionDetails: ChildSection | Section;
    }[];
  childParentSectionMap: Record<number, number>;
  hasAdditionalContent?: boolean;
};
