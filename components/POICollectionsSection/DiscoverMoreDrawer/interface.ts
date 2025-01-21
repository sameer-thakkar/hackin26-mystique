import { CollectionItem } from 'components/slices/CollectionCarousel/interface';

export type TDiscoverMoreDrawerProps = {
  onClose: () => void;
  collectionsList: CollectionItem[];
};

export type TProductInfoCardProps = {
  displayName: string;
  media: {
    type: string;
    url: string;
    metadata: {
      altText: string;
    };
  };
};
