import type { Itinerary } from 'types/itinerary.type';
import { ChildSection, Section } from 'types/itinerary.type';

export type TTimelineViewComponentProps = {
  itinerary: Itinerary;
  variant?: TimelineViewComponentVariant;
  onStopSectionClick?: (
    sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>
  ) => void;
};

export enum TimelineViewComponentVariant {
  DEFAULT = 'DEFAULT',
  REDUCED_WIDTH = 'REDUCED_WIDTH',
}

export type TOnStopClick = (
  sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>,
  stopIndex?: number
) => void;
