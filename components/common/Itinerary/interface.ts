import type { IItinerary } from '@headout/espeon/components/Itinerary';
import type { TTabListItemProps } from 'UI/Tabs/interface';

export type TItineraryComponentProps = {
  itineraryData: IItinerary[];
  lang: string;
  onActiveTabChange?: (tab: TTabListItemProps) => void;
  showTitle?: boolean;
  isHohoItinerary?: boolean;
};
