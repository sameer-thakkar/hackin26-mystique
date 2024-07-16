import AbbaSeatMapSvg from 'assets/abbaSeatMapSvg';
import { SEATING_MAP_CONTENT_TYPE } from './constants';

export type MapHoveredSectionInfoType = {
  isVisible: boolean;
  sectionInfo?: THEATRE_SECTION_TYPE;
  sectionId: string;
  left: number;
  top: number;
};

export type AVAILABLE_SHOWS_TGID = {
  [theatreId: string]: Array<string>;
};

export type SEATING_MAP_TYPE = {
  expUids: Array<string>;
  seatMapTypes: Array<string>;
  headerContent: {
    [id: string]: SEATING_MAP_CONTENT_TYPE;
  };
  mapHoverContent: {
    [theatreId: string]: THEATRE_TYPE;
  };
  availableShowsTgid: AVAILABLE_SHOWS_TGID;
  seatMapSvgs: {
    [theatreId: string]: typeof AbbaSeatMapSvg;
  };
  viewBox: {
    [theatreId: string]: (isMobile: boolean) => string;
  };
  breadCrumbsLabel: {
    [theatreId: string]: string;
  };
};

export type THEATRE_SECTION_TYPE = {
  blockName: string;
  theatreSectionName: string;
  theatreSectionLabel: string;
  description: string;
  sectionsAtTheatre?: string;
  accessibleSeating?: string;
  quickInfo: Array<{
    icon: React.FC<{ width?: string; height?: string }>;
    label: string;
  }>;
  rows: string;
};

export type THEATRE_TYPE = {
  [sectionId: string]: THEATRE_SECTION_TYPE;
};

export type TAddVenueSeatsPageSectionViewedDataEvents = ({
  sectionName,
  rank,
}: {
  sectionName: string;
  rank: number;
}) => void;

export type TSeatMapPageParams = {
  theatreType: string;
  isMobile: boolean;
  breadcrumbs: any;
  addVenueSeatsPageSectionViewedDataEvents: TAddVenueSeatsPageSectionViewedDataEvents;
};

export type TTheatreSvgParams = {
  svgViewBox: string;
  handleSvgOnClick?: (event: any) => void;
  highlightSvgSection?: string;
  disableHover?: boolean;
  isMobile: boolean;
  fadeNearbyElements?: boolean;
};
