import { ChildSection, Itinerary, Section } from 'types/itinerary.type';
import { TCalculateBoundsCallback } from '@headout/aer/src/molecules/LeafletMap/map';

export type TZoomIntoSection = {
  section?: Section;
  childSection?: ChildSection;
};
export type TOnClickTrackEvent = {
  type: string;
  stopName: string;
  stopNumber: number | string;
};
export type TOnZoomTrackEvent = {
  zoomType: 'Zoom In' | 'Zoom Out';
};

export type TNumberedMarkerIcon = {
  title: string;
  stopNumber: number | string;
  color?: string;
};

export type TMapController = {
  map: L.Map;
  zoomIntoSection?: ({ section, childSection }: TZoomIntoSection) => void;
  reset: () => void;
  calculateBounds: TCalculateBoundsCallback;
};

export type TMapProps = {
  itinerary: Itinerary;
  showRoutesTimeline?: boolean;
  activeSectionId?: number;
  onActiveSectionChange?: (id: number) => void;
  onClickTrackEvent?: ({
    type,
    stopName,
    stopNumber,
  }: TOnClickTrackEvent) => void;
  onZoomTrackEvent?: ({ zoomType }: TOnZoomTrackEvent) => void;
};

export type TGetMarkerIconProps = {
  type: string;
  title: string;
  stopNumber: number;
  color?: string;
};

export type TZoomInfo = Record<
  number,
  { zoom: number; bounds: L.LatLngBounds }
> | null;
