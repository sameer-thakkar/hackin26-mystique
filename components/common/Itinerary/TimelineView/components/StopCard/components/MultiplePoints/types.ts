import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';

export type MultiplePointsProps = {
  points: {
    title: string;
    image?: string | null;
    timeForNextSection?: number;
  }[];
  isStartPoint?: boolean;
  /**
   * when index >= 3, consider it as the
   * view more button.
   * @param index index of the clicked item
   * @returns void
   */
  onItemClick: (index: number) => void;
  variant?: TimelineViewComponentVariant;
  itineraryId: number;
};
