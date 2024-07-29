import { Itinerary } from 'types/itinerary.type';

export type TItinerarySwipeSheetProps = {
  itinerary: Itinerary;
  currentLanguage: string;
  visible?: boolean;
  onCloseSwipeSheet?: () => void;
};
