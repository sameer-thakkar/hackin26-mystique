import type { StopCardProps } from 'components/common/Itinerary/TimelineView/components/StopCard/types';

export enum SECTION_TYPE {
  START_LOCATION = 'START_LOCATION',
  STOP = 'STOP',
  END_LOCATION = 'END_LOCATION',
}

export enum CHILD_SECTION_TYPE {
  ATTRACTION = 'ATTRACTION',
  ACTIVITY = 'ACTIVITY',
  FOOD_AND_DRINKS = 'FOOD_DRINKS',
  PASS_BY = 'PASS_BY',
}

export enum INCLUSION {
  // attraction
  ADMISSION_TICKET_INCLUDED = 'ADMISSION_TICKET_INCLUDED',
  FREE_ADMISSION = 'FREE_ADMISSION',
  ADMISSION_TICKET_NOT_INCLUDED = 'ADMISSION_TICKET_NOT_INCLUDED',
  TICKET_INCLUDED_BASED_ON_SELECTION = 'TICKET_INCLUDED_BASED_ON_SELECTION',

  // activity
  INCLUDED_IN_COST = 'INCLUDED_IN_COST',
  INCLUDED_DEPENDING_ON_OPTION_SELECTED = 'INCLUDED_DEPENDING_ON_OPTION_SELECTED',
  INCLUDED_AT_ADDITIONAL_COST = 'INCLUDED_AT_ADDITIONAL_COST',
}

export enum SUB_TYPES {
  // stop
  POI = 'POI',
  LANDMARK = 'LANDMARK',
  SHOPPING_CENTER = 'SHOPPING_CENTER',
  NEIGHBOURHOOD_AREA = 'NEIGHBOURHOOD_AREA',
  SUBSECTION_OF_POI = 'SUBSECTION_OF_POI',
  HOHO_BUS_STOP = 'HOHO_BUS_STOP',

  // ending location
  SAME_AS_MEETING_POINT = 'SAME_AS_MEETING_POINT',
  DIFFERENT_LOCATION_BUT_THE_SAME_FOR_A_TOUR_GROUP = 'DIFFERENT_LOCATION_BUT_THE_SAME_FOR_A_TOUR_GROUP',
  DIFFERENT_LOCATION_BUT_CHANGES_BASIS_SP_OR_TOUR = 'DIFFERENT_LOCATION_BUT_CHANGES_BASIS_SP_OR_TOUR',

  // Menu
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  SNACKS = 'SNACKS',
  DINNER = 'DINNER',
  DRINKS = 'DRINKS',
  OTHERS = 'OTHERS',

  // Starting location
  STARTING_POINT_SAME_VENDOR = 'STARTING_POINT_SAME_VENDOR',
  BOARD_FROM_STOPS = 'BOARD_FROM_STOPS',
  EXPERIENCE_INVOLVES_PICKUP = 'EXPERIENCE_INVOLVES_PICKUP',
  STARTING_POINT_VARIES = 'STARTING_POINT_VARIES',
}

export enum ModeOfTravelOptions {
  CAR = 'CAR',
  SUV = 'SUV',
  MINIVAN = 'MINIVAN',
  BUS_COACH = 'BUS_COACH',
  MINIBUS = 'MINIBUS',
  FERRY = 'FERRY',
  BOAT = 'BOAT',
  SPEEDBOAT = 'SPEEDBOAT',
  YACHT = 'YACHT',
  SHIP = 'SHIP',
  TRAIN = 'TRAIN',
  WALK = 'WALK',
}

export enum ItineraryType {
  CRUISE = 'CRUISE',
  HOHO = 'HOHO',
  GENERIC = 'GENERIC',
}

export interface APIResponse {
  itinerary: Itinerary;
}

export interface Itinerary {
  id: number;
  name: string;
  type: ItineraryType;
  subCategoryId: number;
  active: boolean;
  map?: Map;
  details: ItineraryDetails;
  sections: Section[];
}

export interface Map {
  active: boolean;
  itineraryRoute: ItineraryRoute;
}

export interface ItineraryRoute {
  active: boolean;
  polyline: string;
  polylineColor: string;
}

export interface ItineraryDetails {
  frequency?: string;
  duration?: Duration;
  modeOfTravel?: string;
  mapPreviewLink?: string;
  routeName: string;
  firstDepartureTime?: string;
  firstDepartureStop?: string;
  lastDepartureTime?: string;
  lastDepartureStop?: string;
  popularAttractionsCovered?: string;
  cruiseMenus?: Record<string, any>[];
  meal?: Record<string, any>;
  entertainment?: Record<string, any>;
}

export interface Duration {
  hours: number;
  minutes: number;
}

export interface Section {
  id: number;
  type: SECTION_TYPE;
  attractionsCount: number;
  activitiesCount: number;
  location?: Location;
  details: SectionDetails;
  childSections: ChildSection[];
  rank: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface BaseSectionDetails {
  description?: string;
  descriptionOptions?: string;
  distanceForNextSection?: number;
  distanceFromParent?: number;
  inclusion?: LabelWithLocalization<INCLUSION>;
  location?: Location;
  modeOfTravel?: LabelWithLocalization<ModeOfTravelOptions>;
  name?: string;
  passBy?: boolean;
  sameAsStartingPoint: boolean;
  timeForNextSection?: number;
  timeSpent?: number;
  subType?: LabelWithLocalization<SUB_TYPES>;
  mediaUrls?: Array<string>;
}

export type LabelWithLocalization<T> = {
  label: T;
  localisedLabel: string;
};

export interface SectionDetails extends BaseSectionDetails {
  instruction?: string;
  information?: string;
}

export interface ChildSection {
  id: number;
  type: CHILD_SECTION_TYPE;
  location?: Location;
  details: ChildSectionDetails;
  rank: number;
}

export interface ChildSectionDetails extends BaseSectionDetails {
  timeFromParent?: number;
}

export type THighlights = Omit<
  StopCardProps,
  'subCards' | 'position' | 'multiPointDetails' | 'subSectionDetails'
> & {
  subSectionDetails: ChildSection | Section;
};

export type TNearbyThings = THighlights;
