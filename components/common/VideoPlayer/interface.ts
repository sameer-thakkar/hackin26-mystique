import type Plyr from 'plyr';

export type TVideoPlayerProps = {
  videoUrl: string;
  videoTitle?: string;
  closePlayer?: () => void;
  className?: string;
  showMuteControls?: boolean;
  playPauseThreshold?: number;
  tgid?: string | number;
  onPlayerReady?: (plyr: Plyr) => void;
  isHls?: boolean;
  playerProps?: Plyr.Options;
  playsinline?: boolean;
};
