export interface IShowsListProps {
  isMarginBottomNeeded?: boolean;
  uid: string;
  isMobile: boolean;
  heading: string;
  sliceData: [];
  allShowPageUids: string[];
  isVenuePage: boolean;
  nowPlayingShows: Record<string, any>[];
  upcomingShows: Record<string, any>[];
}

export interface IShowsListUIProps
  extends Omit<IShowsListProps, 'nowPlayingShows' | 'upcomingShows'> {
  data: Record<string, any>[];
}
