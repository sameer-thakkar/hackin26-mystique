import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import CityCategoryCard from 'components/CatAndSubCatPage/CityCategoriesCarousel/CityCategoryCard';
import { CityCategoriesCarouselProps } from 'components/CatAndSubCatPage/CityCategoriesCarousel/interface';
import {
  CarouselControls,
  CityCategoriesCarouselContainer,
  CityCategoriesCarouselSection,
  HeadingContainer,
  SectionHeading,
} from 'components/CatAndSubCatPage/CityCategoriesCarousel/styles';
import {
  handleCarouselControlTracking,
  trackPageSection,
} from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { SECTIONS } from 'const/catAndSubcatPage';
import { CAROUSEL_DIR } from 'const/index';
import { strings } from 'const/strings';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);
const OverflowScroll = dynamic(
  () => import(/* webpackChunkName: "OverflowScroll" */ 'UI/OverflowScroll')
);

const CityCategoriesCarousel: React.FC<CityCategoriesCarouselProps> = (
  props
) => {
  const { cityCategoriesCarousel, isMobile } = props;
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useOnScreen({ ref: sectionRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: SECTIONS.BROWSE_BY_CATEGORIES });
    }
  }, [isIntersecting]);

  useEffect(() => {
    if (!swiper) return;
    setActiveIndex(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  const updateIndex = useCallback(() => {
    if (isMobile || !swiper) return;
    setActiveIndex(swiper.realIndex);
  }, [swiper, isMobile]);

  const goNext = () => {
    if (!swiper) return;
    swiper.slideNext();
    handleCarouselControlTracking({
      section: SECTIONS.BROWSE_BY_CATEGORIES,
      direction: CAROUSEL_DIR.NEXT,
    });
  };

  const goPrev = () => {
    if (!swiper) return;
    swiper.slidePrev();
    handleCarouselControlTracking({
      section: SECTIONS.BROWSE_BY_CATEGORIES,
      direction: CAROUSEL_DIR.PREV,
    });
  };

  const swiperParams: SwiperProps = {
    breakpoints: {
      768: {
        slidesPerView: 2.5,
        slidesPerGroup: 2,
      },
      1024: {
        slidesPerView: 3.5,
        slidesPerGroup: 3,
      },
      1200: {
        slidesPerView: 5,
        slidesPerGroup: 5,
      },
    },
    spaceBetween: 14,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onTouchEnd: () => {},
    onSlideChange: () => updateIndex(),
  };

  const CityCategories = cityCategoriesCarousel.map((cityCategory, index) => {
    const { id } = cityCategory;
    return (
      <CityCategoryCard
        key={id}
        ranking={index}
        {...cityCategory}
        isMobile={isMobile}
      />
    );
  });

  return (
    <CityCategoriesCarouselSection ref={sectionRef}>
      <CityCategoriesCarouselContainer>
        <HeadingContainer>
          <SectionHeading>
            {strings.CAT_SUBCAT_PAGE.BROWSE_BY_CATEGORIES}
          </SectionHeading>
          <Conditional
            if={(!swiper?.isBeginning || !swiper?.isEnd) && !isMobile}
          >
            <CarouselControls>
              <span className="prev-pill">
                <LttChevronLeft
                  onClick={goPrev}
                  disabled={swiper?.isBeginning}
                  aria-label="See previous categories"
                  aria-disabled={swiper?.isBeginning}
                />
              </span>
              <span className="next-pill">
                <LttChevronRight
                  onClick={goNext}
                  disabled={swiper?.isEnd}
                  aria-label="See more categories"
                  aria-disabled={swiper?.isEnd}
                />
              </span>
            </CarouselControls>
          </Conditional>
        </HeadingContainer>
        <div>
          <Conditional if={!isMobile}>
            <Swiper isFreeMode {...swiperParams}>
              {CityCategories}
            </Swiper>
          </Conditional>
          <Conditional if={isMobile}>
            <OverflowScroll
              unsetWrapperMargin={true}
              unsetChildrenMargin={true}
              unsetChildrenPadding={true}
              gap={0.75}
            >
              {CityCategories}
            </OverflowScroll>
          </Conditional>
        </div>
      </CityCategoriesCarouselContainer>
    </CityCategoriesCarouselSection>
  );
};

export default CityCategoriesCarousel;
