export interface IShowsListProps {
  isMarginBottomNeeded?: boolean;
  uid: string;
  isMobile: boolean;
  heading: string;
  allShowPageUids: Record<string, any>[];
  data: any;
}
