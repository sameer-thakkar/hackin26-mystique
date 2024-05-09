import { Dispatch, SetStateAction } from 'react';

export type TTheatreGrid = {
  data: any;
  hostname: string;
  language: string;
  isMobile: boolean;
};

export type TGridUi = {
  heading: string;
  theatresData: Record<string, any>[];
  showPageDocuments: Record<string, any>[];
  hostname: string;
  language: string;
  isMobile: boolean;
};

export type TTheatreChips = {
  nowPlayingShows: Record<string, any>[];
  showPageDocuments: Record<string, any>[];
  hostname: string;
  language: string;
  isMobile: boolean;
  mediaData: Record<string, any>;
};

export type TChips = TTheatreChips & {
  index: number;
  nowPlayingShowTgid: number;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
  setShowTooltip: Dispatch<SetStateAction<boolean>>;
  showTooltip: boolean;
  showPageUrl: string;
  showName: string;
  hostname: string;
  language: string;
  isMobile: boolean;
};
