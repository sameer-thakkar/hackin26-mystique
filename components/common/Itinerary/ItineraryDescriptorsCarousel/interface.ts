import type { Itinerary } from 'types/itinerary.type';
import type { TItineraryDescriptorsComponentProps } from '../ItineraryDescriptors/interface';

export type TItineraryDescriptorsCarouselComponentProps = {
  itinerary: Itinerary;
  lang: string;
};

export type TItineraryDescriptorsCardComponentProps =
  TItineraryDescriptorsComponentProps;
