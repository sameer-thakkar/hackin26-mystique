import { ChildSection, Section } from 'types/itinerary.type';
import { PassesByCardProps } from 'components/common/Itinerary/TimelineView/components/PassesByCard/types';
import { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';

export type TMapViewCardProps = Partial<StopCardProps> &
  Partial<PassesByCardProps> & {
    isPassBy?: boolean;
    stopIndex: number;
    onCardInView?: (
      section: Section | ChildSection | Omit<Section, 'childSections'>
    ) => void;
    stopLabelText?: string;
    childParentSectionMap: Record<number, number>;
    hideViewDetails?: boolean;
    onNearbyCardClick?: (args: {
      sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>;
      subStopId: number;
    }) => void;
  };

export type TMapViewCardButtonProps = {
  type: 'primary' | 'secondary';
  onClick?: () => void;
  label?: string;
  icon?: JSX.Element;
  iconPosition?: 'left' | 'right';
};
