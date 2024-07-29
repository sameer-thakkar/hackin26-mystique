import type { Itinerary } from 'types/itinerary.type';
import type { TTabListItemProps } from 'UI/Tabs/interface';

export type TItineraryComponentProps = {
  itineraryData: Itinerary[];
  lang: string;
  onActiveTabChange?: (tab: TTabListItemProps) => void;
  showTitle?: boolean;
  isHohoItinerary?: boolean;
};
