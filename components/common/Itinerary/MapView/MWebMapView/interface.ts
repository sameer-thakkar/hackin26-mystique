import { Itinerary } from 'types/itinerary.type';

export type TMWebMapViewComponentProps = {
  itinerary: Itinerary;
  onCloseBottomSheet?: () => void;
  onCloseInitBottomSheet?: () => void;
};
