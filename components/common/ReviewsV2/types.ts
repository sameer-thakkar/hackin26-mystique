import type { Swiper as TSwiper } from 'swiper/types';
import type { TReview } from 'types/reviews';
import type { TImageGalleryController } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';

export type TReviewsV2Props = {
  reviews: Array<TReview>;
  collectionDetails?: TCollectionDetails;
  categoryId?: string;
  subCategoryId?: string;
};

export type TUseReviewsV2Props = {
  reviews: Array<TReview>;
  collectionDetails?: TCollectionDetails;
  categoryId?: string;
  subCategoryId?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onSlideChange: (swiper: TSwiper) => void;
  imageGalleryController: React.RefObject<TImageGalleryController>;
};
