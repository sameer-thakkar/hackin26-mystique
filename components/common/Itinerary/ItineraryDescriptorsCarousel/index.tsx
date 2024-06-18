import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import type { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import ItineraryDescriptors from 'components/common/Itinerary/ItineraryDescriptors';
import { ItineraryDescriptorsTypes } from 'components/common/Itinerary/ItineraryDescriptors/interface';
import { useSwiperArrows } from 'hooks/useSwiper';
import { isMobile } from 'utils/helper';
import { getItineraryDescriptorsTypes } from 'utils/itinerary';
import { LeftArrowSvg } from 'assets/leftArrowSvg';
import { RightArrowSvg } from 'assets/rightArrowSvg';
import type {
  TItineraryDescriptorsCardComponentProps,
  TItineraryDescriptorsCarouselComponentProps,
} from './interface';
import {
  StyledItineraryDescriptorCard,
  StyledItineraryDescriptorsCarouselContainer,
} from './styles';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const ItineraryDescriptorsCarousel = ({
  itinerary,
  lang,
}: TItineraryDescriptorsCarouselComponentProps) => {
  const isDesktop = !isMobile();
  const swiperRef = useRef<TSwiper | null>(null);
  const { showRightArrow, showLeftArrow, onSlideChange } = useSwiperArrows();

  const sliderOptions: SwiperProps = {
    slidesPerView: isDesktop ? 4 : 3,
    spaceBetween: 0,
    onSwiper: (swiper: TSwiper) => {
      swiperRef.current = swiper;
      onSlideChange(swiper);
    },
    onSlideChange,
    allowTouchMove: !isDesktop,
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const descriptorTypes = getItineraryDescriptorsTypes(itinerary);

  useEffect(() => {
    if (swiperRef?.current) {
      onSlideChange(swiperRef.current);
    }
  }, [descriptorTypes]);

  const renderItineraryDescriptors = () => {
    return descriptorTypes.map((type) => {
      return (
        <ItineraryDescriptorCard
          key={type}
          type={type as ItineraryDescriptorsTypes}
          itinerary={itinerary}
          componentType={
            descriptorTypes.length <= 3 ? 'horizontal' : 'vertical'
          }
          lang={lang}
        />
      );
    });
  };

  const isSwiperRequired =
    descriptorTypes?.length >= Number(sliderOptions.slidesPerView);

  return (
    <Conditional if={descriptorTypes?.length > 0}>
      <StyledItineraryDescriptorsCarouselContainer>
        <Conditional if={isSwiperRequired}>
          <Swiper {...sliderOptions}>{renderItineraryDescriptors()}</Swiper>
        </Conditional>
        <Conditional if={!isSwiperRequired}>
          <div
            className={classNames(
              'itinerary-descriptors-no-carousel-container',
              descriptorTypes?.length === 3 && 'space-between'
            )}
          >
            {renderItineraryDescriptors()}
          </div>
        </Conditional>
        <Conditional if={isSwiperRequired && showLeftArrow}>
          <button
            className="descriptors-carousel-controls prev"
            onClick={handlePrev}
          >
            <LeftArrowSvg />
          </button>
        </Conditional>
        <Conditional if={isSwiperRequired && showRightArrow}>
          <button
            className="descriptors-carousel-controls next"
            onClick={handleNext}
          >
            <RightArrowSvg />
          </button>
        </Conditional>
      </StyledItineraryDescriptorsCarouselContainer>
    </Conditional>
  );
};

const ItineraryDescriptorCard = ({
  type,
  itinerary,
  componentType,
  lang,
}: TItineraryDescriptorsCardComponentProps) => {
  return (
    <StyledItineraryDescriptorCard>
      <ItineraryDescriptors
        type={type}
        itinerary={itinerary}
        componentType={componentType}
        lang={lang}
      />
    </StyledItineraryDescriptorCard>
  );
};

export default ItineraryDescriptorsCarousel;
