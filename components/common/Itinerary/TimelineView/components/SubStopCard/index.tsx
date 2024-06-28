import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import Descriptors from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors';
import { DescriptorSize } from 'components/common/Itinerary/TimelineView/components/StopCard/components/Descriptors/types';
import type { TSubStopCardProps } from 'components/common/Itinerary/TimelineView/components/SubStopCard/interface';
import {
  SpaceBlock,
  StyledSubStopCardContainer,
} from 'components/common/Itinerary/TimelineView/components/SubStopCard/styles';
import { useSwiperArrows } from 'hooks/useSwiper';
import SubStopMediaCard from './MediaCard';
import SubStopSwiperNavigationButtons from './SwiperNavigationButtons';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);
const AnimatedSwiperPaginationDots = dynamic(
  () =>
    import(
      /* webpackChunkName: "AnimatedSwiperPaginationDots" */ 'components/common/AnimatedSwiperPaginationDots'
    )
);
const PassByItemCard = dynamic(
  () =>
    import(
      /* webpackChunkName: "PassByItemCard" */ 'components/common/Itinerary/TimelineView/components/PassByItemCard'
    )
);

const SubStopCard = ({
  subSectionDetails,
  sectionDetails,
  descriptors,
  variant,
  isHOHOItinerary,
  itineraryId,
}: TSubStopCardProps) => {
  const { details, id, rank } = subSectionDetails || sectionDetails;
  const { name, mediaUrls = [] } = details ?? {};
  const swiperRef = useRef<TSwiper | null>(null);
  const { onSlideChange, showRightArrow, showLeftArrow } = useSwiperArrows();

  const swiperSettings: SwiperProps = {
    slidesPerView: 1,
    spaceBetween: 0,
    onSwiper: (swiper: TSwiper) => {
      swiperRef.current = swiper;
      onSlideChange(swiper);
    },
    onSlideChange,
    allowTouchMove: false,
  };

  const renderMediaImages = () => {
    return mediaUrls.map((url, index) => (
      <SubStopMediaCard url={url} key={`media-${index}`} />
    ));
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };
  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleDotClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  return (
    <>
      <Conditional if={isHOHOItinerary}>
        <PassByItemCard
          id={id!}
          details={details!}
          rank={rank!}
          itineraryId={itineraryId}
        />
      </Conditional>
      <Conditional if={!isHOHOItinerary}>
        <StyledSubStopCardContainer
          $hasMediaImages={!!mediaUrls.length}
          id={`itinerary-card-${itineraryId}-${id}`}
        >
          <div className="content-container">
            <h5 className="card-heading">{name}</h5>
            <Descriptors
              {...descriptors}
              variant={variant}
              descriptorSize={DescriptorSize.SMALL}
            />
            <Conditional if={mediaUrls?.length}>
              <SpaceBlock $gap={'0.5rem'} />
            </Conditional>
            <Conditional
              if={mediaUrls.length > Number(swiperSettings.slidesPerView)}
            >
              <div className="swiper-controls">
                <AnimatedSwiperPaginationDots
                  slidesCount={swiperRef.current?.slides?.length ?? 0}
                  onDotClick={handleDotClick}
                  activeIndex={swiperRef.current?.activeIndex}
                />
                <SubStopSwiperNavigationButtons
                  showLeftArrow={showLeftArrow}
                  showRightArrow={showRightArrow}
                  prevSlide={handlePrev}
                  nextSlide={handleNext}
                />
              </div>
            </Conditional>
          </div>
          <Conditional if={!!mediaUrls.length}>
            <div className="image-carousel">
              <Swiper {...swiperSettings}>{renderMediaImages()}</Swiper>
            </div>
          </Conditional>
        </StyledSubStopCardContainer>
      </Conditional>
    </>
  );
};

export default SubStopCard;
