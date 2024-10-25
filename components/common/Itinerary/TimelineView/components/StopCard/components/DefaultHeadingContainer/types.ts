import type { MultiplePointsProps } from '../MultiplePoints/types';

export type TDefaultHeadingContainerProps = {
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
  isStopSectionClickable?: boolean;
};
