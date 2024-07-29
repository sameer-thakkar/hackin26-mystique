import {
  CHILD_SECTION_TYPE,
  SECTION_TYPE,
  SUB_TYPES,
} from 'types/itinerary.type';
import { Props } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/types';

export type SubStopCardProps = {
  id?: number;
  title?: string;
  imageURL?: string;
  descriptors?: Props;
  description?: string;
  iconType?: SUB_TYPES | CHILD_SECTION_TYPE | SECTION_TYPE;
  location?: Location;
  link?: string | null;
};
