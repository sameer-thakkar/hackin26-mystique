export type TDayTripsVideoPlayerProps = {
  section?: DayTripsVideoPlayerSection;
  previewVideoUrl: string;
  videoUrl: string;
  onPlayerReady?: (plyr: Plyr) => void;
  thumbnailUrl?: string;
  playPauseOnHover?: boolean;
  autoplay?: boolean;
  height?: number;
  playPauseThreshold?: number;
  showChatBubble?: boolean;
  chatBubbleText?: string;
  showPlayButton?: boolean;
  isMobile?: boolean;
  muted?: boolean;
  showSkeleton?: boolean;
  delay?: number;
  collectionId?: number;
};

export enum DayTripsVideoPlayerPlayType {
  HOVER = 'Hover',
  BUTTON_CLICK = 'Button Click',
  PLAYER_CLICK = 'Player Click',
  AUTO = 'Auto',
}

export enum DayTripsVideoPlayerViewType {
  INLINE = 'Inline',
  MODAL = 'Modal',
}

export enum DayTripsVideoPlayerSection {
  BANNER = 'Banner',
  LIST = 'List',
}
