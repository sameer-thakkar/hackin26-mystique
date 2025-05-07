import type {
  DayTripsVideoPlayerPlayType,
  DayTripsVideoPlayerSection,
} from 'components/DayTripsVideoPlayer/types';

export type TDayTripsVideoPlayerModalProps = {
  section?: DayTripsVideoPlayerSection;
  playType?: DayTripsVideoPlayerPlayType;
  hostname?: string;
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  onPlayerReady?: (plyr: Plyr) => void;
  playPauseThreshold?: number;
  muted?: boolean;
  isMobile?: boolean;
  collectionId?: number;
};
