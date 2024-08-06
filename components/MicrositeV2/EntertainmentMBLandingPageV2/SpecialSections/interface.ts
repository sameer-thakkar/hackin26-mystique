export interface ISpecialSections {
  allTours: any;
  isMobile: boolean;
  title: string;
  actions: {
    actionName: string;
    onClick: () => any[] | Promise<any[]>;
  }[];
  updateActions?: (actions: any) => void;
  totalNumberOfShows: number;
  seeAllCardText: string;
  preselectedActionName?: string;
  maxNumberOfShows?: number;
  hideSeeAll?: boolean;
  showSeeAll?: boolean;
  useForcedSekeltonLoaders?: boolean;
  handleSeaAllClicked?: () => void;
  id?: string;
  showHigherQualityImage?: boolean;
}
