export interface CollectionItem {
  collectionId: number;
  url: string;
  label: string;
  collectionData: Record<string, any>;
}

export interface ICollectionCarousel {
  isMobile: boolean;
  primaryCity?: Record<string, any>;
  taggedCity: string | null;
  allCollectionsData: {
    menu: Record<string, CollectionItem>;
  };
  isLfcComponent?: boolean;
}

export interface IHandleCardClick {
  id: number;
  name: string;
  rank: number;
  url: string;
}
