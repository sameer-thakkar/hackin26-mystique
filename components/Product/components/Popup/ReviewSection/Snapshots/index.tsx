import React, { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import NavigationButtons from 'components/common/NavigationButtons';
import Swiper from 'components/Swiper';
import useInfiniteList from 'hooks/useInfiniteList';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import type { TSnapshotSectionProps } from './interface';
import CarouselItem from './item';
import {
  MobileCarousel,
  StyledContainer,
  StyledHeading,
  StyledHeadingWrapper,
} from './styles';

const SnapshotSection = ({
  onImageClick,
  reviewMedias,
  isDesktop = true,
  infiniteList,
}: TSnapshotSectionProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);
  const [activeSlide, changeActiveSlideTo] = useState(0);

  const mediaCarouselRef = useRef<SwiperType | null>(null);
  const imageHeight = isDesktop ? 184 : 130;
  const imageWidth = isDesktop ? 136 : 98;

  useInfiniteList<{
    localIndex: number;
    reviewId: number;
    globalIndex: number;
  }>({
    callback: infiniteList?.fetchNext,
    identifier: (item) =>
      `.snapshot-item-${item?.globalIndex}[data-review-id="${item?.reviewId}"][data-local-index="${item?.localIndex}"]`,
    canFetch: infiniteList?.canFetch,
    items: reviewMedias.map(({ location }) => location),
  });

  useEffect(() => {
    const currentIsLoaded = [...isLoaded];
    if (currentIsLoaded.length >= reviewMedias.length) return;
    const updatedIsLoaded = reviewMedias
      .slice(currentIsLoaded.length)
      .reduce((acc) => [...acc, false], currentIsLoaded);
    setIsLoaded(updatedIsLoaded);
  }, [reviewMedias]);

  if (!reviewMedias?.length) return null;

  const onImageLoad = (index: number) => {
    setIsLoaded((currentIsLoaded) =>
      currentIsLoaded.map((v, ind) => (ind === index ? true : v))
    );
  };

  const carouselItems = reviewMedias.map(
    ({ url, location, fileName }, index) => (
      <CarouselItem
        key={`traveler-media-tiles-${location.globalIndex}`}
        url={url}
        height={imageHeight}
        width={imageWidth}
        fileName={fileName}
        onClick={() => {
          if (isLoaded[index]) {
            onImageClick?.(location);
            trackEvent({
              eventName: ANALYTICS_EVENTS.GUEST_SNAPSHOT_CLICKED,
              [ANALYTICS_PROPERTIES.RANKING]: index + 1,
              [ANALYTICS_PROPERTIES.POSITION]: 'Snapshots Section',
            });
          }
        }}
        isLoaded={isLoaded[index]}
        onLoad={() => onImageLoad(index)}
        location={location}
      />
    )
  );

  return (
    <StyledContainer>
      <StyledHeadingWrapper>
        <StyledHeading>{strings.SNAPSHOTS_SECTION_HEADER}</StyledHeading>
        <Conditional if={carouselItems?.length > 4 && isDesktop}>
          <div className="navigation-buttons-container">
            <NavigationButtons
              showLeftArrow={activeSlide !== 0}
              showRightArrow={activeSlide < reviewMedias.length - 5}
              prevSlide={() => {
                mediaCarouselRef.current?.slidePrev();
              }}
              nextSlide={() => {
                mediaCarouselRef.current?.slideNext();
              }}
            />
          </div>
        </Conditional>
      </StyledHeadingWrapper>
      {isDesktop ? (
        <Swiper
          slidesPerView={5}
          slidesPerGroup={5}
          allowTouchMove={false}
          onSwiper={(swiper) => {
            mediaCarouselRef.current = swiper;
          }}
          onSlideChange={(s) => {
            changeActiveSlideTo(s.activeIndex);
          }}
        >
          {carouselItems}
        </Swiper>
      ) : (
        <MobileCarousel>{carouselItems}</MobileCarousel>
      )}
    </StyledContainer>
  );
};

export default SnapshotSection;
