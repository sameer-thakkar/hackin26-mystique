import { useEffect, useMemo, useState } from 'react';
import type { Swiper as TSwiper } from 'swiper/types';
import type { TImageGalleryReviewMedia } from 'components/common/ReviewsV2/components/ReviewElement/types';
import { SECTION_NAME } from 'components/common/ReviewsV2/constants';
import type { TUseReviewsV2Props } from 'components/common/ReviewsV2/types';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

export const useReviewsV2 = ({
  reviews,
  collectionDetails,
  categoryId,
  subCategoryId,
  containerRef,
  onSlideChange,
  imageGalleryController,
}: TUseReviewsV2Props) => {
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const [reviewMedias, setReviewMedias] = useState<TImageGalleryReviewMedia[]>(
    []
  );
  const [selectedReviewMediaIndex, setSelectedReviewMediaIndex] = useState<
    number | null
  >(null);

  const isIntersecting = useOnScreen({
    ref: containerRef,
    unobserve: true,
  });

  const shouldShowImageGallery = useMemo(() => {
    return (
      reviewIndex !== null &&
      selectedReviewMediaIndex !== null &&
      reviewMedias.length > 0
    );
  }, [reviewIndex, selectedReviewMediaIndex, reviewMedias]);

  useEffect(() => {
    if (isIntersecting) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
      });
    }
  }, [isIntersecting]);

  const onHideImageGallery = () => {
    setSelectedReviewMediaIndex(null);
    setReviewMedias([]);
    setReviewIndex(null);
  };

  const handleReviewImageClick = (params: {
    mediaIndex: number;
    reviewId: number;
    reviewMedia: TImageGalleryReviewMedia[];
  }) => {
    const { mediaIndex, reviewId, reviewMedia } = params;
    setSelectedReviewMediaIndex(mediaIndex);
    setReviewMedias(reviewMedia);
    setReviewIndex(reviewId);
    setTimeout(() => {
      imageGalleryController.current?.open();
    }, 100);
  };

  const getReviewDataById = (reviewId: number) => {
    return reviews.find((review) => review.id === reviewId);
  };

  const handleSlideChange = (swiper: TSwiper) => {
    onSlideChange(swiper);
    trackSlideChange();
  };

  const trackSlideChange = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.REVIEWS_CAROUSEL_SCROLLED,
      [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAME,
      ...(collectionDetails?.id && {
        [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionDetails.id,
      }),
      ...(collectionDetails?.displayName && {
        [ANALYTICS_PROPERTIES.COLLECTION_NAME]: collectionDetails.displayName,
      }),
      ...(categoryId && { [ANALYTICS_PROPERTIES.CATEGORY_ID]: categoryId }),
      ...(subCategoryId && {
        [ANALYTICS_PROPERTIES.SUB_CAT_ID]: subCategoryId,
      }),
    });
  };

  return {
    reviewMedias,
    selectedReviewMediaIndex,
    onHideImageGallery,
    handleReviewImageClick,
    getReviewDataById,
    handleSlideChange,
    trackSlideChange,
    shouldShowImageGallery,
  };
};
