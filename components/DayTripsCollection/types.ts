export type TDayTripsCollectionPageProps = {
  id: string;
  cityCode: string;
  currentCityCode: string;
  query: any;
  collectionBannerMedia: any;
  collectionsInfo: any;
  paginationParams: any;
};

export type TExperiencesSectionProps = {
  paginationParams: any;
  productListInfo: any;
  setShowFloatingActionButton: (show: boolean) => void;
  collectionsInfo: any;
  highlightTGID: number | null;
  hasValidHighlightedTGID: boolean;
};
