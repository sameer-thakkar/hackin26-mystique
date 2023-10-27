import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Swiper } from 'swiper';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import SwiperWrapper from 'components/Swiper';
import Image from 'UI/Image';
import {
  CarouselContainer,
  NextButtonContainer,
  PrevButtonContainer,
} from 'UI/MediaCarousel/styles';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  VIDEO_POSITIONS,
} from 'const/index';
import { CHEVRON_LEFT_CIRCLE } from 'assets/SvgIcons';

const Video = dynamic(() => import(/* webpackChunkName: "Video" */ 'UI/Video'));

type MediaCarouselProps = {
  imageList: Array<{ url: string; altText: string }>;
  videoUrl?: string;
  imageId?: string;
  imageAspectRatio?: string;
  imageWidth?: number;
  imageHeight?: number;
  isFirstProduct?: boolean; // prevent lazy load on the first image of first product
  tgid: string;
  backgroundColor?: string;
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
  backgroundColor,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen({
    ref: carouselRef,
    options: { threshold: 0.75 },
  });
  const [isVisibilityTracked, setIsVisibilityTracked] = useState(false);
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
    grabCursor: imageList.length > 1,
    preloadImages: false,
    onSlideChangeTransitionStart: updateIndex,
    onSwiper: (swiper) => setSwiperInstance(swiper),
  };
  const imageClassNames = `swiper-lazy ${imageId}`;

  return (
    <CarouselContainer $backgroundColor={backgroundColor} ref={carouselRef}>
      <SwiperWrapper {...swiperParams}>
        {imageList.map((image, index) => {
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
              shouldVideoPlay={currentIndex === 0}
              videoPosition={VIDEO_POSITIONS.PRODUCT_CARD}
              showPauseIcon={false}
              showPlayIcon={false}
            />
          ) : (
            <Image
              key={image.url}
              url={image.url}
              imageId={imageClassNames}
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
        <PrevButtonContainer onClick={onPrev}>
          <button className={'navigation-button'}>{CHEVRON_LEFT_CIRCLE}</button>
        </PrevButtonContainer>
        <NextButtonContainer onClick={onNext}>
          <button className={'navigation-button'}>{CHEVRON_LEFT_CIRCLE}</button>
        </NextButtonContainer>
      </Conditional>
    </CarouselContainer>
  );
};

export default MediaCarousel;
