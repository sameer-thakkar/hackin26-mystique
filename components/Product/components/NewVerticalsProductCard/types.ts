import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { ItineraryDetails, ItineraryType, Section } from 'types/itinerary.type';
import { TController } from 'components/NewVerticals/RouteDetails/Popup/interface';
import { LanguagesUnion } from 'const/index';
import { TController as TPdfController } from '../Popup/interface';

export type TGetCustomDescriptors = {
  isHOHO: boolean;
  isCruises: boolean;
  descriptorsObject: Record<string, string>;
  itineraryDetails: ItineraryDetails;
  itinerarySections: Section[];
  defaultDescriptors: Record<string, any>;
  itineraryPopupController: React.MutableRefObject<TController | undefined>;
  setIsItineraryDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsDescriptorClick: Dispatch<SetStateAction<boolean>>;
  itineraryType: ItineraryType;
  lang: LanguagesUnion;
  tgid: number | string;
};

export type TDescriptorsList = {
  type: string;
  text: string;
  onClick?: () => void;
};

export type TMenuCard = {
  title: string;
  url: string;
  index: number;
  popupController: MutableRefObject<TPdfController | undefined>;
};

export type TMenuSection = {
  menuData: Record<string, any>[];
  tgid: number | string;
  rank: number;
};
