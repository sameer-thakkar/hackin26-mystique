import type { TReview, TReviewMedia } from 'types/reviews';

export type TReviewElementProps = {
  collectionDetails?: TCollectionDetails;
  categoryId?: string;
  subCategoryId?: string;
  reviewerImageUrl?: string | null;
  /**
   * If this is absent, story mode will always open on click.
   * @param index index of the selected image per review
   * @returns a boolean, if truthy opens in story mode
   */
  onImageClick?: (params: {
    mediaIndex: number;
    reviewId: number;
    reviewMedia: TImageGalleryReviewMedia[];
  }) => void;
  shouldFocusProductCardOnCTAClick?: boolean;
} & TReview;

export type TImageGalleryReviewMedia = TReviewMedia & {
  location: { localIndex: number; reviewId: number; globalIndex: number };
  alt: string;
};

export type TUseReviewElementProps = {
  collectionDetails?: TCollectionDetails;
  categoryId?: string;
  subCategoryId?: string;
  onImageClick?: (params: {
    mediaIndex: number;
    reviewId: number;
    reviewMedia: TImageGalleryReviewMedia[];
  }) => void;
  shouldFocusProductCardOnCTAClick?: boolean;
} & TReview;
