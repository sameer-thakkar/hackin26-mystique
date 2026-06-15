import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import {
  EPopupState,
  type TImageGalleryProps,
} from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/interface';
import {
  AllPhotosCta,
  GalleryPopup,
  ImageGalleryWrapper,
  ReviewInfo,
} from 'components/MicrositeV2/ShowPageV2/ShowPageBanner/ImageGallery/style';
import ReviewHeader from 'components/Reviews/Header';
import Image from 'UI/Image';
import useInfiniteList from 'hooks/useInfiniteList';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import AllPhotos from 'assets/allPhotos';
import BackArrow from 'assets/backArrow';
import ChevronLeftCircle from 'assets/chevronLeftCircle';
import SwipesheetCross from 'assets/swipesheetCross';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: true });

const ImageGallery = ({
  imageUploads = [],
  startFrom = 0,
  onHide,
  onShow,
  showMoreButton = true,
  hideFirstImageInOverlay = false,
  controlBodyOverflow = true,
  navigation = 'cross',
  imageDimensions,
  controller,
  infiniteList,
  title,
  isShowPageExperiment,
  getAssociatedReview,
}: TImageGalleryProps) => {
  const [popupState, setPopupState] = useState<EPopupState>(
    EPopupState.INITIAL
  );
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [startFromIndex, setStartFromIndex] = useState(startFrom);

  useInfiniteList<{
    localIndex: number;
    reviewId: number;
    globalIndex: number;
  }>({
    callback: infiniteList?.fetchNext,
    identifier: (item) =>
      `.image-gallery-list-${item?.globalIndex}[data-review-id="${item?.reviewId}"][data-local-index="${item?.localIndex}"]`,
    canFetch: infiniteList?.canFetch,
    items: imageUploads?.map(({ location }) => location),
  });

  const swiperParams: SwiperProps = {
    slidesPerView: 1,
    centeredSlides: false,
    initialSlide: startFromIndex,
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    direction: 'horizontal',
  };

  const review = useMemo(
    () =>
      getAssociatedReview?.(imageUploads?.[activeIndex]?.location?.reviewId),
    [imageUploads, activeIndex]
  );

  const openPopup = (index?: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.ALL_PHOTOS,
      [ANALYTICS_PROPERTIES.SECTION]: 'Header',
    });
    setPopupState(EPopupState.OPEN);
    if (index !== undefined) {
      setStartFromIndex(index);
    }
    if (controlBodyOverflow) document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setPopupState(EPopupState.CLOSED);
    if (controlBodyOverflow) document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (controller) {
      controller.current = {
        open: openPopup,
        close: closePopup,
      };
    }
  }, []);

  useEffect(() => {
    const bannerVideo = document.getElementById(
      'show-page-banner'
    ) as HTMLVideoElement;
    if (!bannerVideo && !controller) return;

    if (popupState === EPopupState.OPEN) {
      bannerVideo?.pause();
    } else {
      bannerVideo?.play();
    }
  }, [popupState]);

  useEffect(() => {
    if (popupState === EPopupState.INITIAL) return;

    if (popupState === EPopupState.OPEN) onShow?.(review);
    else onHide?.(review);
  }, [popupState]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (popupState !== EPopupState.OPEN) return;

      if (event.key === 'Escape') {
        closePopup();
      } else if (
        event.key === 'ArrowRight' &&
        swiper &&
        activeIndex < imageUploads?.length - 1
      ) {
        moveNext();
      } else if (event.key === 'ArrowLeft' && swiper && activeIndex > 0) {
        movePrev();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [popupState, swiper, activeIndex, imageUploads?.length]);

  const onListImageClicked = (index: number) => {
    swiper?.slideTo(index);
  };

  const moveNext = () => {
    if (!swiper) return;
    swiper.slideNext();
    if (review)
      trackEvent({
        eventName: ANALYTICS_EVENTS.REVIEWS_MEDIA_SCROLLED,
        [ANALYTICS_PROPERTIES.RATING]: review.rating,
        [ANALYTICS_PROPERTIES.CHEVRON_SCROLLED]: 'right',
      });
  };

  const movePrev = () => {
    if (!swiper) return;
    swiper.slidePrev();
    if (review)
      trackEvent({
        eventName: ANALYTICS_EVENTS.REVIEWS_MEDIA_SCROLLED,
        [ANALYTICS_PROPERTIES.RATING]: review.rating,
        [ANALYTICS_PROPERTIES.CHEVRON_SCROLLED]: 'left',
      });
  };

  useEffect(() => {
    const selectedListImage = document.querySelector(
      `.image-gallery-list-${activeIndex}`
    );

    selectedListImage?.scrollIntoView({
      inline: 'center',
      behavior: 'smooth',
      block: 'center',
    });

    if (popupState === EPopupState.OPEN) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.IMAGE_GALLERY.IMAGE_VIEWED,
        [ANALYTICS_PROPERTIES.RANKING]: activeIndex + 1,
      });
    }
  }, [activeIndex, popupState]);

  return (
    <ImageGalleryWrapper $isShowPageExperiment={isShowPageExperiment}>
      <Conditional if={showMoreButton}>
        <AllPhotosCta onClick={() => openPopup()}>
          {AllPhotos} {strings.SHOW_PAGE_V2.ALL_PHOTOS}
        </AllPhotosCta>
      </Conditional>

      <GalleryPopup isPopupActive={popupState === EPopupState.OPEN}>
        <div
          className="overlay"
          onClick={closePopup}
          role="button"
          tabIndex={0}
        ></div>
        <div className="header">
          <div className="all-photos">
            <Conditional if={navigation === 'arrow'}>
              <div
                className="close-button"
                onClick={closePopup}
                role="button"
                tabIndex={0}
              >
                <BackArrow />
              </div>
            </Conditional>
            <span>{title ?? strings.SHOW_PAGE_V2.ALL_PHOTOS}</span>
          </div>
          <Conditional if={navigation === 'cross'}>
            <div
              className="close-button"
              onClick={closePopup}
              role="button"
              tabIndex={0}
            >
              {SwipesheetCross}
            </div>
          </Conditional>
        </div>
        <div className="main-content">
          <div className="primary-section">
            <div
              onClick={movePrev}
              role="button"
              tabIndex={0}
              className={`chevron chevron-left ${
                (activeIndex ?? 0) <= 0 ? 'inactive' : ''
              }`}
            >
              {ChevronLeftCircle}
            </div>
            <div
              onClick={moveNext}
              role="button"
              tabIndex={0}
              className={`chevron chevron-right ${
                (activeIndex ?? 0) >= imageUploads?.length - 1 ? 'inactive' : ''
              }`}
            >
              {ChevronLeftCircle}
            </div>

            <Swiper
              {...swiperParams}
              onSlideChange={({ realIndex }) => setActiveIndex(realIndex)}
            >
              {imageUploads
                .slice(hideFirstImageInOverlay ? 1 : 0)
                .map(({ url, alt }, index) => (
                  <Image
                    url={url}
                    alt={alt}
                    priority
                    key={`main-${index}`}
                    autoCrop={true}
                    className={`image-gallery-${index} image-gallery-primary`}
                    fetchPriority="high"
                    fitCrop={true}
                    {...(imageDimensions?.spotlight && {
                      ...imageDimensions?.spotlight,
                    })}
                  />
                ))}
            </Swiper>
            {review && (
              <ReviewInfo>
                <ReviewHeader {...review} />
              </ReviewInfo>
            )}
          </div>
          <div className="image-list-section">
            {imageUploads
              .slice(hideFirstImageInOverlay ? 1 : 0)
              .map(({ url, alt }, index) => {
                return (
                  <Image
                    draggable={false}
                    url={url}
                    alt={alt}
                    priority
                    autoCrop={true}
                    className={`image-gallery-list-${index} gallery-list-image ${
                      activeIndex === index ? 'active' : ''
                    }`}
                    fetchPriority="high"
                    fitCrop={true}
                    key={`tn-${index}`}
                    onClick={() => onListImageClicked(index)}
                    {...(imageDimensions?.thumbnail && {
                      ...imageDimensions?.thumbnail,
                    })}
                    {...(imageUploads[index]?.location && {
                      dataAttributes: {
                        'data-local-index':
                          imageUploads[index]?.location?.localIndex,
                        'data-review-id':
                          imageUploads[index]?.location?.reviewId,
                      },
                    })}
                  />
                );
              })}
          </div>
        </div>
      </GalleryPopup>
    </ImageGalleryWrapper>
  );
};

export default ImageGallery;
