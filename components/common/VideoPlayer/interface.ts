export type TVideoPlayerProps = {
  videoUrl: string;
  videoTitle?: string;
  closePlayer?: () => void;
  className?: string;
  showMuteControls?: boolean;
  playPauseThreshold?: number;
  tgid?: string | number;
  onPlayerReady?: () => void;
};
