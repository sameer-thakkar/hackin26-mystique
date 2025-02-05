export type TCollectionHeaderMobileProps = {
  items: any[]; // TODO replace with TJumpLinkItem
  hasReviews: boolean;
  collectionsInfo: {
    destination: {
      displayName: string;
    };
    cityCode: string;
    displayName: string;
    subtext: string;
  };
  collectionBannerMedia: {
    images: {
      url: string;
      alt: string;
    }[];
    video?: {
      url: string;
    };
  };
};
