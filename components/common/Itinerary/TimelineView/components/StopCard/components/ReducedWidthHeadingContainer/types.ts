import type { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import type { MultiplePointsProps } from '../MultiplePoints/types';

export type TReducedWidthHeadingContainerProps = {
  allowOpen?: boolean;
  hasMultiPoints?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  isSubCard?: boolean;
  isOpen?: boolean;
  hasMultipleSubStops?: boolean;
  position?: number;
  name: string;
  multiPoints?: MultiplePointsProps;
  variant: TimelineViewComponentVariant;
  isStopSectionClickable?: boolean;
  endPointIsNotSameAsStart?: boolean;
};
