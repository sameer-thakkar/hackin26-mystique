import { ChildSection, ItineraryType, Section } from 'types/itinerary.type';
import type { PassesByCardProps } from 'components/common/Itinerary/TimelineView/components/PassesByCard/types';
import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';

export type TMapViewCardProps = Partial<StopCardProps> &
  Partial<PassesByCardProps> & {
    isPassBy?: boolean;
    cardTag?: JSX.Element;
    stopIndex: number;
    itineraryType: ItineraryType;
    onCardInView?: (
      section: Section | ChildSection | Omit<Section, 'childSections'>
    ) => void;
  };

export type TMapViewCardButtonProps = {
  type: 'primary' | 'secondary';
  onClick?: () => void;
  label?: string;
  icon?: JSX.Element;
  iconPosition?: 'left' | 'right';
};
