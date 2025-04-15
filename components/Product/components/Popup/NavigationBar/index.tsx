import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import { useSwiperArrows } from 'hooks/useSwiper';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
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
  currentActiveIndexInfo: {
    index: number;
    isForcedChange: boolean;
  };
  onItemClick: (index: number) => void;
  isVisible?: boolean;
  isReviewsSectionPresent?: boolean;
  isItinerarySectionPresent?: boolean;
  isHohoItinerary?: boolean;
  tgid?: string | number;
};

const NavigationBar = ({
  tabs = [],
  currentActiveIndexInfo,
  isVisible,
  onItemClick,
  isReviewsSectionPresent = false,
  isItinerarySectionPresent = false,
  isHohoItinerary = false,
  tgid,
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
  const ITINERARY_TAB_INDEX = 2;
  const { index: currentActiveIndex, isForcedChange: isTabClickScroll } =
    currentActiveIndexInfo;

  useEffect(() => {
    const activeTab =
      isItinerarySectionPresent && currentActiveIndex === ITINERARY_TAB_INDEX
        ? { heading: 'Itinerary' }
        : isReviewsSectionPresent && currentActiveIndex === reviewSectionIndex
        ? { heading: 'Reviews' }
        : tabs[currentActiveIndex];

    trackEvent({
      eventName: ANALYTICS_EVENTS.MORE_DETAILS_SECTION_TAB_VIEWED,
      [ANALYTICS_PROPERTIES.TAB_NAME]: activeTab?.heading,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.NAVIGATION_TYPE]: isTabClickScroll
        ? 'Click'
        : 'Scroll',
    });
  }, [currentActiveIndexInfo]);

  const renderTabs = () => {
    const navigationTabs = [
      ...tabs?.slice(0, ITINERARY_TAB_INDEX)?.map(({ heading }, index) => (
        <NavigationLink
          key={`navigation-bar-item-${index}`}
          $isSelected={currentActiveIndex === index}
          onClick={() => onItemClick(index)}
          data-navigation-bar-index={index}
        >
          {heading}
        </NavigationLink>
      )),
    ];
    if (isItinerarySectionPresent)
      navigationTabs.push(
        <NavigationLink
          key={`itinerary-section-${ITINERARY_TAB_INDEX}`}
          $isSelected={currentActiveIndex === ITINERARY_TAB_INDEX}
          onClick={() => onItemClick(ITINERARY_TAB_INDEX)}
          data-navigation-bar-index={ITINERARY_TAB_INDEX}
          className="navigation-link"
        >
          {isHohoItinerary ? strings.HOHO.ROUTES : strings.ITINERARY.TAB}
          <div className="new-tag">{strings.NEW}</div>
        </NavigationLink>
      );

    navigationTabs.push(
      ...tabs?.slice(ITINERARY_TAB_INDEX)?.map(({ heading }, index) => {
        const finalIndex =
          index + ITINERARY_TAB_INDEX + (isItinerarySectionPresent ? 1 : 0);
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
