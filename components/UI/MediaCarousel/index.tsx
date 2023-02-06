import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Swiper } from 'swiper';
import type { SwiperProps } from 'swiper/react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import SwiperWrapper from 'components/Swiper';
import Conditional from 'components/common/Conditional';
import Video from 'UI/Video';
import Image from 'UI/Image';
import {
  CarouselContainer,
  NextButtonContainer,
  PrevButtonContainer,
} from 'UI/MediaCarousel/styles';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

type MediaCarouselProps = {
  imageList: Array<{ url: string; altText: string }>;
  videoUrl?: string;
  imageId?: string;
  imageAspectRatio?: string;
  imageWidth?: number;
  imageHeight?: number;
  isFirstProduct?: boolean; // prevent lazy load on the first image of first product
  tgid: string;
  isMobile: boolean;
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
}) => {
  const carouselRef = useRef<ReactNode>(null);
  const isOnScreen = useOnScreen({
    ref: carouselRef,
    options: { threshold: 0.75 },
  });
  const [isVisibilityTracked, setIsVisibilityTracked] = useState(false);
  // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
  const [swiper, setSwiperInstance] = useState<Swiper>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const getImageViewEventProperties = ({
    rank
  }: any) => ({
    eventName: ANALYTICS_EVENTS.PRODUCT_CARD_IMAGE_VIEWED,
    [ANALYTICS_PROPERTIES.TGID]: tgid,
    [ANALYTICS_PROPERTIES.RANKING]: rank,
  });

  const updateIndex = useCallback(() => {
    if (swiper !== null) {
      const slideIndex = swiper.realIndex;
      setCurrentIndex(slideIndex);
      trackEvent(getImageViewEventProperties({ rank: slideIndex + 1 }));
    }
  }, [swiper]);

  const onPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
    }
  };

  const onNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
    }
  };

  useEffect(() => {
    if (!isVisibilityTracked && isOnScreen) {
      trackEvent(getImageViewEventProperties({ rank: 1 }));
      setIsVisibilityTracked(true);
    }
  }, [isOnScreen]);

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
      clickable: true,
    },
    speed: 600,
    grabCursor: true,
    preloadImages: false,
    onSlideChangeTransitionStart: updateIndex,
    onSwiper: (swiper) => setSwiperInstance(swiper),
  };

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <CarouselContainer ref={carouselRef}>
      <SwiperWrapper {...swiperParams}>
        {imageList.map((image, index) => {
          return videoUrl && index === 0 ? (
            <Video
              url={videoUrl}
              fallbackImage={image}
              imageAspectRatio={imageAspectRatio}
              imageId={imageId}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              dontLazyLoadImage={isFirstProduct}
              shouldVideoPlay={currentIndex === 0}
            />
          ) : (
            <Image
              url={image.url}
              imageId={classNames({ [imageId]: true, 'swiper-lazy': true })}
              alt={image.altText}
              aspectRatio={imageAspectRatio}
              autoCrop={false}
              width={imageWidth}
              height={imageHeight}
              priority={isMobile && isFirstProduct && index === 0}
              fetchPriority={
                isMobile && isFirstProduct && index === 0 ? 'high' : 'auto'
              }
              fill
            />
          );
        })}
      </SwiperWrapper>

      <Conditional if={imageList.length > 1 && !isMobile}>
        <PrevButtonContainer>
          <button className={'navigation-button'} onClick={onPrev}>
            {CHEVRON_LEFT}
          </button>
        </PrevButtonContainer>
        <NextButtonContainer>
          <button className={'navigation-button'} onClick={onNext}>
            {CHEVRON_LEFT}
          </button>
        </NextButtonContainer>
      </Conditional>
    </CarouselContainer>
  );
};

export default MediaCarousel;
