import { BaseSectionDetails } from 'types/itinerary.type';

export type Props = {
  inclusion?: BaseSectionDetails['inclusion'];
  duration?: number;
  attractionsCount?: number;
  activitiesCount?: number;
  foodTypes?: BaseSectionDetails['subType'];
};

export type DescriptorProps = {
  icon?: JSX.Element | null;
  text?: string;
};
