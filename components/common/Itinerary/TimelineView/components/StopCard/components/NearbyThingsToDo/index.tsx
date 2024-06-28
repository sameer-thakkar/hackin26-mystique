import { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import PassByItemCard from 'components/common/Itinerary/TimelineView/components/PassByItemCard';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import { useSwiperArrows } from 'hooks/useSwiper';
import { strings } from 'const/strings';
import {
  CarouselContainer,
  Container,
  HeadingContainer,
  NearbyCardsContainer,
} from './styles';
import { NearbyThingsToDoProps } from './types';

const NavigationButtons = dynamic(
  () =>
    import(
      /* webpackChunkName: "NavigationButtons" */ 'components/common/NavigationButtons'
    )
);
const SwiperWrapper = dynamic(
  () => import(/* webpackChunkName: "SwiperWrapper" */ 'components/Swiper')
);

const NearbyThingsToDo = ({
  passBys = [],
  variant = TimelineViewComponentVariant.DEFAULT,
  itineraryId,
  onClick,
}: NearbyThingsToDoProps) => {
  const swiperRef = useRef<TSwiper | null>(null);

  const { showRightArrow, showLeftArrow, onSlideChange } = useSwiperArrows();

  const swiperParams: SwiperProps = {
    lazy: {
      enabled: true,
      loadOnTransitionStart: true,
      loadPrevNext: true,
      loadPrevNextAmount: 1,
    },
    loop: false,
    loopPreventsSlide: false,
    autoplay: false,
    speed: 600,
    grabCursor: passBys.length > 1,
    preloadImages: false,
    onSwiper: (swiper: TSwiper) => {
      swiperRef.current = swiper;
      onSlideChange(swiper);
    },
    onSlideChange,
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 8,
  };

  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

  const isReducedWidthVariant =
    variant === TimelineViewComponentVariant.REDUCED_WIDTH;

  return (
    <Container>
      <HeadingContainer>
        <p className="passby-heading">
          {strings.ITINERARY.SUB_SECTION_HEADING.NEARBY_THINGS_TO_DO}
        </p>
        <Conditional
          if={passBys.length > 2 && (showLeftArrow || showRightArrow)}
        >
          <NavigationButtons
            showLeftArrow={showLeftArrow}
            showRightArrow={showRightArrow}
            nextSlide={handleNext}
            prevSlide={handlePrev}
          />
        </Conditional>
      </HeadingContainer>
      <Conditional if={!isReducedWidthVariant}>
        <CarouselContainer>
          <SwiperWrapper {...swiperParams}>
            {passBys.map((passBy, index) => (
              <PassByItemCard
                key={index}
                {...passBy}
                itineraryId={itineraryId}
              />
            ))}
          </SwiperWrapper>
        </CarouselContainer>
      </Conditional>
      <Conditional if={isReducedWidthVariant}>
        <NearbyCardsContainer>
          {passBys.map((passBy, index) => (
            <PassByItemCard
              key={index}
              {...passBy}
              itineraryId={itineraryId}
              onClick={onClick}
            />
          ))}
        </NearbyCardsContainer>
      </Conditional>
    </Container>
  );
};

export default NearbyThingsToDo;
