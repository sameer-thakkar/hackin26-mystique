import { THEATRE_SECTION_TYPE } from 'components/SeatMapPage/interface';

export type TMapHoverInfoCardParams = {
  sectionInfo?: THEATRE_SECTION_TYPE;
  left: number;
  top: number;
  isVisible: boolean;
  theatreType: string;
};
