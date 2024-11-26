import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import dynamic from 'next/dynamic';
import type { Swiper } from 'swiper';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import SwiperWrapper from 'components/Swiper';
import Image from 'UI/Image';
import {
  CarouselContainer,
  modalStyles,
  NextButtonContainer,
  PaginatorWrapper,
  PrevButtonContainer,
  VideoCTA,
} from 'UI/MediaCarousel/styles';
import { Paginator } from 'UI/Paginator';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CAROUSEL_UNITS,
  VIDEO_POSITIONS,
} from 'const/index';
import ChevronLeftCircle from 'assets/chevronLeftCircle';
import VideoPlayIcon from 'assets/playIcon';

const Video = dynamic(() => import(/* webpackChunkName: "Video" */ 'UI/Video'));
const VideoPlayer = dynamic(
  () =>
    import(/* webpackChunkName: "Plyr Video" */ 'components/common/VideoPlayer')
);

type MediaCarouselProps = {
  imageList: Array<{ url: string; altText: string }>;
  videoUrl?: string;
  imageId?: string;
  imageAspectRatio?: string;
  imageWidth?: number;
  imageHeight?: number;
  isFirstProduct?: boolean; // prevent lazy load on the first image of first product
  tgid?: string;
  backgroundColor?: string;
  isMobile: boolean;
  shouldCrop?: boolean;
  differentBorderRadiusForMobile?: boolean;
  showOverlay?: boolean;
  showPagination?: boolean;
  showTimedPaginator?: boolean;
  bottomPosition?: string;
  enableAutoplay?: boolean;
  isTimed?: boolean;
  trackImage?: boolean;
  hideBorderRadius?: boolean;
  useWidePaginatorActiveTab?: boolean;
  uid?: string;
  shouldBePlayingVideo?: boolean;
  position?: number;
  isImageQualityExperiment?: boolean;
  hideGrabCursor?: boolean;
  showVideoOnProductCard?: boolean;
};

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  imageList = [],
  videoUrl,
  imageId = '',
  imageAspectRatio = '',
  imageWidth,
  imageHeight,
  isFirstProduct,
  tgid,
  isMobile,
  backgroundColor,
  shouldCrop,
  differentBorderRadiusForMobile = true,
  showOverlay = false,
  showPagination = true,
  showTimedPaginator = false,
  bottomPosition,
  enableAutoplay = false,
  isTimed = true,
  trackImage = true,
  hideBorderRadius,
  shouldBePlayingVideo = true,
  position,
  hideGrabCursor = false,
  showVideoOnProductCard = false,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen({
    ref: carouselRef,
    options: { threshold: showVideoOnProductCard ? 1 : 0.75 },
  });

  const [modalIsOpen, setModalOpen] = useState(false);
  const [isVisibilityTracked, setIsVisibilityTracked] = useState(false);
  const [isInvisibilityTracked, setIsInvisibilityTracked] = useState(false);
  const [swiper, setSwiperInstance] = useState<Swiper | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const getImageViewEventProperties = ({ rank }: any) => ({
    eventName: ANALYTICS_EVENTS.PRODUCT_CARD_IMAGE_VIEWED,
    [ANALYTICS_PROPERTIES.TGID]: tgid,
    [ANALYTICS_PROPERTIES.RANKING]: rank,
  });

  const updateIndex = useCallback(() => {
    if (swiper !== null) {
      const slideIndex = swiper.realIndex;
      setCurrentIndex(slideIndex);
      if (trackImage && tgid) {
        trackEvent(getImageViewEventProperties({ rank: slideIndex + 1 }));
      }
    }
  }, [swiper]);

  const onPrev = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (swiper !== null) {
      swiper.slidePrev();
    }
  };

  const onNext = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (swiper !== null) {
      swiper.slideNext();
    }
  };

  useEffect(() => {
    if (!isVisibilityTracked && isOnScreen) {
      trackEvent(getImageViewEventProperties({ rank: 1 }));
      if (videoUrl && !isMobile)
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_VIDEO_VIEWED,
          [ANALYTICS_PROPERTIES.TGID]: tgid,
          [ANALYTICS_PROPERTIES.POSITION]: position,
        });
      setIsVisibilityTracked(true);
    }
  }, [isOnScreen]);

  useEffect(() => {
    if (!isInvisibilityTracked && !isOnScreen && isVisibilityTracked) {
      if (videoUrl && !isMobile)
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_VIDEO_OUT_OF_VIEW,
          [ANALYTICS_PROPERTIES.TGID]: tgid,
          [ANALYTICS_PROPERTIES.POSITION]: position,
        });
      setIsInvisibilityTracked(true);
    }
  }, [isOnScreen, isVisibilityTracked]);

  const swiperParams: SwiperProps = {
    lazy: {
      enabled: true,
      loadOnTransitionStart: true,
      loadPrevNext: true,
      loadPrevNextAmount: 1,
    },
    loop: true,
    loopedSlides: imageList.length,
    loopPreventsSlide: false,
    allowTouchMove: imageList.length > 1,
    pagination: {
      enabled: showPagination,
      clickable: true,
    },
    autoplay: enableAutoplay
      ? {
          delay: 3000,
        }
      : false,
    speed: 600,
    grabCursor: !hideGrabCursor && imageList.length > 1,
    preloadImages: false,
    onSlideChangeTransitionStart: updateIndex,
    onSwiper: (swiper) => setSwiperInstance(swiper),
  };

  const imageClassNames = `swiper-lazy ${imageId}`;

  const onVideoClick = () => {
    document.body.style.overflow = 'hidden';
    setModalOpen(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.PRODUCT_VIDEO_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.POSITION]: position,
    });
  };

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setModalOpen(false);
    trackEvent({
      eventName: ANALYTICS_EVENTS.VIDEO_PLAYER_CLOSED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.POSITION]: position,
    });
  };

  return (
    <CarouselContainer
      $backgroundColor={backgroundColor}
      ref={carouselRef}
      $differentBorderRadiusForMobile={differentBorderRadiusForMobile}
      $showOverlay={showOverlay}
      $hideBorderRadius={hideBorderRadius}
    >
      <SwiperWrapper {...swiperParams}>
        {imageList.map((image, index) => {
          const isLCPCandidate = isMobile && isFirstProduct && index === 0;

          return videoUrl && index === 0 ? (
            <Video
              key={videoUrl}
              url={videoUrl}
              fallbackImage={image}
              imageAspectRatio={imageAspectRatio}
              imageId={imageId}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              dontLazyLoadImage={isFirstProduct}
              shouldVideoPlay={currentIndex === 0 && !isMobile && isOnScreen}
              shouldBePlayingVideo={
                isOnScreen && !modalIsOpen && shouldBePlayingVideo
              }
              videoPosition={VIDEO_POSITIONS.PRODUCT_CARD}
              showPauseIcon={false}
              showPlayIcon={false}
              onClick={onVideoClick}
              isMuted
            />
          ) : (
            <Image
              key={image.url}
              url={image.url}
              imageId={imageClassNames}
              alt={image.altText}
              aspectRatio={imageAspectRatio}
              autoCrop={false}
              fitCrop={shouldCrop}
              {...(shouldCrop && {
                cropMode: ['faces', 'center'],
              })}
              width={imageWidth}
              height={imageHeight}
              priority={isLCPCandidate}
              fetchPriority={isLCPCandidate ? 'high' : 'auto'}
              fill
              loadHigherQualityImage={true}
            />
          );
        })}
      </SwiperWrapper>

      <Conditional if={videoUrl && currentIndex === 0 && !isMobile}>
        <VideoCTA onClick={onVideoClick}>
          <VideoPlayIcon />
          <p>Sneak Peek</p>
        </VideoCTA>
        <Conditional if={modalIsOpen}>
          <Modal
            style={modalStyles}
            onRequestClose={closeModal}
            isOpen={modalIsOpen}
            shouldCloseOnEsc
            shouldCloseOnOverlayClick
            shouldReturnFocusAfterClose
            preventScroll={true}
          >
            <VideoPlayer
              videoUrl={videoUrl!}
              closePlayer={closeModal}
              showMuteControls
              tgid={tgid}
            />
          </Modal>
        </Conditional>
      </Conditional>

      {showTimedPaginator && (
        <PaginatorWrapper bottomPosition={bottomPosition}>
          <Paginator
            tabSize={1.5}
            dotSize={6 / 16}
            totalCount={imageList.length}
            activeIndex={currentIndex}
            limit={4}
            activeSlideTimer={isTimed ? 3000 : 0}
            size={12 / 16}
            margin={2 / 16}
            containerWidthOverride={
              (CAROUSEL_UNITS.dotsLimit - 1) *
                (CAROUSEL_UNITS.mobileDotSize +
                  2 * CAROUSEL_UNITS.mobileDotMargin) +
              (CAROUSEL_UNITS.mobileTabSize +
                2 * CAROUSEL_UNITS.mobileTabMargin)
            }
            enableTranslate={true}
            enableCompletedColor={true}
          />
        </PaginatorWrapper>
      )}
      <Conditional if={imageList.length > 1 && !isMobile}>
        <PrevButtonContainer onClick={onPrev}>
          <button className={'navigation-button'}>{ChevronLeftCircle}</button>
        </PrevButtonContainer>
        <NextButtonContainer onClick={onNext}>
          <button className={'navigation-button'}>{ChevronLeftCircle}</button>
        </NextButtonContainer>
      </Conditional>
    </CarouselContainer>
  );
};

export default MediaCarousel;
