import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import NavigationButtons from 'components/common/NavigationButtons';
import ReviewElement from 'components/common/ReviewsV2/components/ReviewElement';
import type { TImageGalleryController } from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import Swiper, { type ISwiperWrapper } from 'components/Swiper';
import { useSwiperArrows } from 'hooks/useSwiper';
import { appAtom } from 'store/atoms/app';
import { strings } from 'const/strings';
import HeadoutHeart from 'assets/headoutHeart';
import { useReviewsV2 } from './hooks/useReviewsV2';
import { ImageGalleryContainer, StyledReviewsV2Wrapper } from './styles';
import type { TReviewsV2Props } from './types';

const ImageGallery = dynamic(
  () =>
    import(
      /* webpackChunkName: "ImageGallery" */ 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery'
    ),
  { ssr: false }
);

const ReviewsV2 = ({
  reviews,
  collectionDetails,
  categoryId,
  subCategoryId,
  shouldFocusProductCardOnCTAClick = true,
}: TReviewsV2Props) => {
  const { isMobile } = useRecoilValue(appAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<TSwiper | null>(null);
  const imageGalleryController = useRef<TImageGalleryController>(null);

  const { showRightArrow, showLeftArrow, onSlideChange } = useSwiperArrows();

  const {
    reviewMedias,
    selectedReviewMediaIndex,
    onHideImageGallery,
    handleReviewImageClick,
    getReviewDataById,
    handleSlideChange,
    trackSlideChange,
    shouldShowImageGallery,
  } = useReviewsV2({
    reviews,
    collectionDetails,
    categoryId,
    subCategoryId,
    containerRef,
    onSlideChange,
    imageGalleryController,
  });

  const swiperProps: Partial<ISwiperWrapper> = {
    slidesPerView: isMobile ? 1 : 4,
    slidesPerGroup: isMobile ? 1 : 4,
    speed: 600,
    allowTouchMove: isMobile,
    onSwiper: (swiper: TSwiper) => {
      swiperRef.current = swiper;
      onSlideChange(swiper);
    },
    onSlideChange: handleSlideChange,
  };

  if (!reviews?.length) return null;

  return (
    <>
      <Conditional if={shouldShowImageGallery}>
        <ImageGalleryContainer>
          <ImageGallery
            imageUploads={reviewMedias}
            startFrom={selectedReviewMediaIndex!}
            controller={imageGalleryController}
            onHide={onHideImageGallery}
            showMoreButton={false}
            hideFirstImageInOverlay={false}
            controlBodyOverflow={false}
            getAssociatedReview={getReviewDataById}
          />
        </ImageGalleryContainer>
      </Conditional>
      <StyledReviewsV2Wrapper ref={containerRef}>
        <div className="heading-container">
          <div className="heading">
            <h2 className="heading-text">{strings.REVIEWS_SECTION.HEADING}</h2>
            <HeadoutHeart />
          </div>
          <Conditional if={!isMobile}>
            <NavigationButtons
              showLeftArrow={showLeftArrow}
              showRightArrow={showRightArrow}
              nextSlide={() => swiperRef.current?.slideNext()}
              prevSlide={() => swiperRef.current?.slidePrev()}
              buttonSize="large"
            />
          </Conditional>
        </div>
        <Conditional if={!isMobile}>
          <Swiper {...swiperProps}>
            {reviews?.map((reviewItem) => (
              <ReviewElement
                key={reviewItem.id}
                {...reviewItem}
                onImageClick={handleReviewImageClick}
                collectionDetails={collectionDetails}
                categoryId={categoryId}
                subCategoryId={subCategoryId}
                shouldFocusProductCardOnCTAClick={
                  shouldFocusProductCardOnCTAClick
                }
              />
            ))}
          </Swiper>
        </Conditional>
        <Conditional if={isMobile}>
          <div
            className="mobile-carousel-container"
            onScroll={trackSlideChange}
          >
            {reviews?.map((reviewItem) => (
              <ReviewElement
                key={reviewItem.id}
                {...reviewItem}
                onImageClick={handleReviewImageClick}
                collectionDetails={collectionDetails}
                shouldFocusProductCardOnCTAClick={
                  shouldFocusProductCardOnCTAClick
                }
              />
            ))}
          </div>
        </Conditional>
      </StyledReviewsV2Wrapper>
    </>
  );
};

export default ReviewsV2;
