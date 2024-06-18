import type { Itinerary } from 'types/itinerary.type';

export type TItineraryDescriptorsComponentProps = {
  type: ItineraryDescriptorsTypes;
  itinerary: Itinerary;
  componentType?: 'horizontal' | 'vertical';
  lang: string;
};

export enum ItineraryDescriptorsTypes {
  TOTAL_DURATION = 'TOTAL_DURATION',
  FREQUENCY = 'FREQUENCY',
  FIRST_DEPARTURE = 'FIRST_DEPARTURE',
  LAST_DEPARTURE = 'LAST_DEPARTURE',
  FOOD_AND_DRINKS = 'FOOD_AND_DRINKS',
  MODE_OF_TRANSPORT = 'MODE_OF_TRANSPORT',
  FIRST_DEPARTURE_TIME = 'FIRST_DEPARTURE_TIME',
  LAST_DEPARTURE_TIME = 'LAST_DEPARTURE_TIME',
}
