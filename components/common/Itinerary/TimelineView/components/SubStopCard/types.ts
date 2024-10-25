import { ChildSection } from 'types/itinerary.type';
import { TOnStopClick } from '../../interface';

export type TSubStopCardProps = Omit<ChildSection, 'type' | 'rank'> & {
  link?: string | null;
  itineraryId: number;
  onClick?: TOnStopClick;
  rank?: number;
};
