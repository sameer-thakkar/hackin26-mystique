import React, { useCallback, useRef } from 'react';
import { cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { Swiper } from 'components/Espeon/Common/CustomSwiper';
import { DIRECTIONS } from 'components/Espeon/Common/CustomSwiper/constants';
import type {
  TSwiperDirection,
  TSwiperRefActions,
} from 'components/Espeon/Common/CustomSwiper/types';
import { Image } from 'components/Espeon/Common/Image';
import {
  EImageFetchPriority,
  EImageLoading,
  EImagePlaceholder,
} from 'components/Espeon/Common/Image/types';
import { useSwiperArrows } from 'components/Espeon/hooks/useSwiperArrows';
import NavigationButton from './NavigationButton';
import { mediaCarouselWrapper } from './styles';
import type { TProductMediaCarousel } from './types';

const MediaCarousel = ({
  images,
  className,
  variant,
  isMobile,
  productCardPosition,
  onSwiperChange,
  width,
  height,
  aspectRatio,
}: TProductMediaCarousel) => {
  const swiperRef = useRef<TSwiperRefActions>(null);
  const { showLeftArrow, showRightArrow, onSlideChanged } = useSwiperArrows();

  const handleSwiperButton = useCallback(
    (event: React.MouseEvent, direction: TSwiperDirection) => {
      event.preventDefault();
      event.stopPropagation();

      if (swiperRef.current) {
        if (direction === DIRECTIONS.FORWARD) {
          swiperRef.current?.nextSlide();
        } else {
          swiperRef.current?.prevSlide();
        }
      }
    },
    []
  );

  if (!images) return null;

  return (
    <div className={cx('group', mediaCarouselWrapper(variant), className)}>
      <Conditional if={!isMobile && showLeftArrow}>
        <NavigationButton
          ariaLabel={'Previous slide'}
          onClick={(e) => handleSwiperButton(e, 'backward')}
          position="left"
        />
      </Conditional>
      <Conditional if={!isMobile && showRightArrow}>
        <NavigationButton
          ariaLabel={'Next slide'}
          onClick={(e) => handleSwiperButton(e, 'forward')}
          position="right"
        />
      </Conditional>

      <Swiper
        swiperRef={swiperRef}
        slidesToScrollBy={1}
        slidesToShow={1}
        onSlideChanged={(props: any) => {
          const { index } = props;
          onSwiperChange?.(index!);
          onSlideChanged(props);
        }}
        isMobile={isMobile}
        loop={true}
        paginationDots={true}
        allowLoopOnMobile={true}
      >
        {images.map((image: any, index: number) => {
          const { altText, url } = image || [];
          const isFirstIndex = index === 0;
          const isFirstImage = isFirstIndex && productCardPosition === 1;

          return (
            <Image
              key={index}
              url={url || ''}
              alt={altText || ''}
              quality={100}
              width={width}
              height={height}
              aspectRatio={aspectRatio || isMobile ? '16:10' : ''}
              {...(isFirstImage && {
                priority: true,
                fetchPriority: EImageFetchPriority.High,
              })}
              {...(!isFirstIndex && {
                loading: EImageLoading.Lazy,
              })}
              {...(!isFirstImage && {
                placeholder: EImagePlaceholder.Blur,
              })}
            />
          );
        })}
      </Swiper>
    </div>
  );
};

export default MediaCarousel;
