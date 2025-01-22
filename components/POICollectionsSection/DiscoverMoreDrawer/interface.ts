import { CollectionItem } from 'components/slices/CollectionCarousel/interface';

export type TDiscoverMoreDrawerProps = {
  onClose: () => void;
  collectionsList: CollectionItem[];
  cityName: string;
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
