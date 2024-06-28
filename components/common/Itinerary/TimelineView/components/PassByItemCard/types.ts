import { ChildSection } from 'types/itinerary.type';
import { TOnStopClick } from '../../interface';

export type TPassesByItemCardProps = Omit<ChildSection, 'type'> & {
  link?: string | null;
  itineraryId: number;
  onClick?: TOnStopClick;
};
