import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import { SECTION_NAMES } from 'components/HOHO/constants';
import { genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CAROUSEL_DIR,
} from 'const/index';
import { strings } from 'const/strings';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';
import AttractionCard from './AttractionCard';
import { TAttractionsCarousel } from './interface';
import {
  CarouselContainer,
  CarouselControls,
  HeadingContainer,
  SectionHeading,
  Wrapper,
} from './styles';
import { extractAttractionsData } from './utils';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);
const OverflowScroll = dynamic(
  () => import(/* webpackChunkName: "OverflowScroll" */ 'UI/OverflowScroll')
);

const AttractionsCarousel = (props: TAttractionsCarousel) => {
  const {
    routeSectionsData,
    isMobile,
    index,
    isSightsCovered,
    hideStopName = false,
    excludeStopAsAttraction = false,
  } = props;
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [, setActiveIndex] = useState(0);

  const updateIndex = useCallback(() => {
    if (isMobile || !swiper) return;
    setActiveIndex(swiper.realIndex);
  }, [swiper, isMobile]);

  const goNext = () => {
    if (!swiper) return;
    swiper.slideNext();
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
      [ANALYTICS_PROPERTIES.DIRECTION]: CAROUSEL_DIR.NEXT,
      [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.TOP_ATTRACTIONS_COVERED,
    });
  };

  const goPrev = () => {
    if (!swiper) return;
    swiper.slidePrev();
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
      [ANALYTICS_PROPERTIES.DIRECTION]: CAROUSEL_DIR.PREV,
      [ANALYTICS_PROPERTIES.SECTION]: SECTION_NAMES.TOP_ATTRACTIONS_COVERED,
    });
  };

  const swiperParams: SwiperProps = {
    initialSlide: 0,
    slidesPerGroup: isSightsCovered ? 6 : 3,
    slidesPerView: 'auto',
    spaceBetween: isSightsCovered ? 16 : 12,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onTouchEnd: () => {},
    onSlideChange: () => updateIndex(),
  };

  const attractionsList = extractAttractionsData({
    routeSectionsData,
    excludeStopAsAttraction,
  });

  const topAttractions = attractionsList?.map((attraction, index) => (
    <AttractionCard
      {...attraction}
      index={index}
      isMobile={isMobile}
      key={genUniqueId()}
      hideStopName={hideStopName}
    />
  ));
  return (
    <Wrapper>
      <CarouselContainer>
        <Conditional if={!(isSightsCovered && isMobile)}>
          <HeadingContainer>
            <SectionHeading>
              {isSightsCovered
                ? strings.CRUISES.SIGHTS_COVERED
                : strings.HOHO.TOP_ATTRACTIONS}
            </SectionHeading>
            <Conditional
              if={(!swiper?.isBeginning || !swiper?.isEnd) && !isMobile}
            >
              <CarouselControls>
                <span className="prev-pill">
                  <LttChevronLeft
                    onClick={goPrev}
                    disabled={swiper?.isBeginning}
                    aria-label={`See previous`}
                    aria-disabled={swiper?.isBeginning}
                  />
                </span>
                <span className="next-pill">
                  <LttChevronRight
                    onClick={goNext}
                    disabled={swiper?.isEnd}
                    aria-label={`See more`}
                    aria-disabled={swiper?.isEnd}
                  />
                </span>
              </CarouselControls>
            </Conditional>
          </HeadingContainer>
        </Conditional>

        <div>
          <Conditional if={!isMobile}>
            <Swiper {...swiperParams} key={index}>
              {topAttractions}
            </Swiper>
          </Conditional>
          <Conditional if={isMobile}>
            <OverflowScroll
              unsetWrapperMargin={false}
              unsetChildrenMargin={true}
              unsetChildrenPadding={true}
              gap={0.75}
              trackingObject={{
                eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
                [ANALYTICS_PROPERTIES.SECTION]:
                  SECTION_NAMES.TOP_ATTRACTIONS_COVERED,
              }}
            >
              {topAttractions}
            </OverflowScroll>
          </Conditional>
        </div>
      </CarouselContainer>
    </Wrapper>
  );
};
export default AttractionsCarousel;
