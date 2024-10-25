import { BaseSectionDetails, type Location } from 'types/itinerary.type';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';

export type Props = {
  inclusion?: BaseSectionDetails['inclusion'];
  duration?: number;
  attractionsCount?: number;
  activitiesCount?: number;
  foodTypes?: BaseSectionDetails['subType'];
  variant?: TimelineViewComponentVariant;
  descriptorSize?: DescriptorSize;
  location?: Location;
  showLocationDescriptor?: boolean;
};

export type DescriptorProps = {
  icon?: JSX.Element | null;
  text?: string;
  size?: DescriptorSize;
};

export enum DescriptorSize {
  SMALL = 'small',
  LARGE = 'large',
}
