import { SectionDetails } from 'types/itinerary.type';

export type NextDestinationTravelProps = Pick<
  SectionDetails,
  'modeOfTravel' | 'timeForNextSection' | 'distanceForNextSection'
>;
