import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import { useSwiperArrows } from 'hooks/useSwiper';
import { strings } from 'const/strings';
import { LeftArrowSvg } from 'assets/leftArrowSvg';
import { RightArrowSvg } from 'assets/rightArrowSvg';
import {
  ButtonGradient,
  NavigationContainer,
  NavigationLink,
  NavigationParent,
} from './styles';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

type Props = {
  tabs?: any[];
  currentActiveIndex: number;
  onItemClick: (index: number) => void;
  isVisible?: boolean;
  isReviewsSectionPresent?: boolean;
  isItinerarySectionPresent?: boolean;
  isHohoItinerary?: boolean;
};

const NavigationBar = ({
  tabs = [],
  currentActiveIndex,
  isVisible,
  onItemClick,
  isReviewsSectionPresent = false,
  isItinerarySectionPresent = false,
  isHohoItinerary = false,
}: Props) => {
  const swiperRef = useRef<TSwiper | null>(null);
  const { showRightArrow, showLeftArrow, onSlideChange } = useSwiperArrows();

  const sliderOptions: SwiperProps = {
    slidesPerView: 'auto',
    slidesPerGroup: isItinerarySectionPresent ? 5 : 6,
    spaceBetween: 8,
    onSwiper: (swiper: TSwiper) => {
      swiperRef.current = swiper;
      onSlideChange(swiper);
    },
    onSlideChange,
    allowTouchMove: false,
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const isSwiperRequired =
    tabs?.length +
      (isItinerarySectionPresent ? 1 : 0) +
      (isReviewsSectionPresent ? 1 : 0) >=
    (isItinerarySectionPresent ? 6 : 7);

  useEffect(() => {
    if (swiperRef?.current) {
      onSlideChange(swiperRef.current);
    }
  }, []);

  const reviewSectionIndex = tabs.length + (isItinerarySectionPresent ? 1 : 0);

  const renderTabs = () => {
    const navigationTabs = [
      ...tabs?.slice(0, 1)?.map(({ heading }, index) => (
        <NavigationLink
          key="navigation-bar-item-0"
          $isSelected={currentActiveIndex === 0}
          onClick={() => onItemClick(index)}
          data-navigation-bar-index={0}
        >
          {heading}
        </NavigationLink>
      )),
    ];
    if (isItinerarySectionPresent)
      navigationTabs.push(
        <NavigationLink
          key={`itinerary-section-${1}`}
          $isSelected={currentActiveIndex === 1}
          onClick={() => onItemClick(1)}
          data-navigation-bar-index={1}
          className="navigation-link"
        >
          {isHohoItinerary ? strings.HOHO.ROUTES : strings.ITINERARY.TAB}
          <div className="new-tag">{strings.NEW}</div>
        </NavigationLink>
      );

    navigationTabs.push(
      ...tabs?.slice(1)?.map(({ heading }, index) => {
        const finalIndex = index + 1 + (isItinerarySectionPresent ? 1 : 0);
        return (
          <NavigationLink
            key={`navigation-bar-item-${finalIndex}`}
            $isSelected={currentActiveIndex === finalIndex}
            onClick={() => onItemClick(finalIndex)}
            data-navigation-bar-index={finalIndex}
            className="navigation-link"
          >
            {heading}
          </NavigationLink>
        );
      })
    );

    if (isReviewsSectionPresent) {
      navigationTabs.push(
        <NavigationLink
          key={`navigation-bar-item-${reviewSectionIndex}`}
          $isSelected={currentActiveIndex === reviewSectionIndex}
          onClick={() => onItemClick(reviewSectionIndex)}
          data-navigation-bar-index={reviewSectionIndex}
          className="navigation-link"
        >
          {strings.SHOW_PAGE_V2.CONTENT_TABS.Reviews}
        </NavigationLink>
      );
    }
    return navigationTabs;
  };

  return (
    <NavigationParent $isVisible={isVisible}>
      <NavigationContainer $isVisible={isVisible}>
        <Conditional if={isSwiperRequired}>
          <Swiper {...sliderOptions}>{renderTabs()}</Swiper>
        </Conditional>
        <Conditional if={!isSwiperRequired}>
          <>{renderTabs()}</>
        </Conditional>
        <Conditional if={isSwiperRequired && showLeftArrow}>
          <button
            className="descriptors-carousel-controls prev"
            onClick={handlePrev}
          >
            <LeftArrowSvg />
          </button>
          <ButtonGradient $isLeft />
        </Conditional>
        <Conditional if={isSwiperRequired && showRightArrow}>
          <button
            className="descriptors-carousel-controls next"
            onClick={handleNext}
          >
            <RightArrowSvg />
          </button>

          <ButtonGradient />
        </Conditional>
      </NavigationContainer>
    </NavigationParent>
  );
};

export default NavigationBar;
