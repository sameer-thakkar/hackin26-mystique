import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import {
  CategoriesSectionWrapper,
  CategoryCarousel,
  TitleRow,
} from 'components/MicrositeV2/LttLandingPageV2/CategoryCarouselsSection/styles';
import VerticalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { getCategorySeeAllLink } from 'utils/helper';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { LTT_CHEVRON_LEFT, LTT_CHEVRON_RIGHT } from 'assets/SvgIcons';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);

type ICategoryCarouselsSection = {
  categoryProps?: any;
  allTours: any;
  isMobile: boolean;
  category?: any;
};

const CATEGORIES_TO_SHOW_IN_ORDER = [
  'New Arrivals',
  'Musicals',
  'Plays',
  'Comedy',
  'Opera',
  'Coming Soon',
];

const CategoryCarouselSwiper = ({
  category,
  isMobile,
  allTours,
  index,
}: ICategoryCarouselsSection & { index: number }) => {
  const sliderList = isMobile
    ? category.ranking.popularity.slice(0, 10)
    : category.ranking.popularity;
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [hasIntersectingEventFired, sethasIntersectingEventFired] = useState(
    false
  );

  const sectionRef = useRef(null);
  const isSectionIntersecting = useOnScreen({
    ref: sectionRef,
    unobserve: true,
  });

  useEffect(() => {
    if (!swiper) return;
    setActiveSlideIdx(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  useEffect(() => {
    if (isSectionIntersecting && !hasIntersectingEventFired) {
      sethasIntersectingEventFired(true);
      trackEvent({
        eventName: ANALYTICS_EVENTS.PAGE_SECTION_VIEWED,
        Category: category.name,
        [ANALYTICS_PROPERTIES.RANKING]: 2 + index,
      });
    }
  }, [isSectionIntersecting]);

  const goNext = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx + 6;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Next',
        Category: category.name,
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          6,
          sliderList?.length - newIndex
        ),
      });
    }
  };
  const goPrev = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx - 6;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Previous',
        Category: category.name,
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          6,
          sliderList?.length - newIndex
        ),
      });
    }
  };
  const swiperParams: SwiperProps = {
    slidesPerView: isMobile ? 'auto' : 6,
    spaceBetween: isMobile ? 16 : 24,
    style: { overflow: 'visible' },
    freeMode: {
      enabled: true,
    },
    onTouchEnd: () => {},
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
  };

  const handleSeaAllClicked = () => {
    if (category.name) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.SEE_ALL_CLICKED,
        [ANALYTICS_PROPERTIES.CATEGORY]: category.name,
      });
      window.open(getCategorySeeAllLink(category.name.toLowerCase()), '_blank');
    }
  };

  return (
    <CategoryCarousel
      id={category.name}
      className={`hroizontally-aligned-child`}
      key={category.id}
      ref={sectionRef}
    >
      <TitleRow>
        <div className="title">{category.name}</div>
        <div className="controls">
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <span className="see-all" onClick={handleSeaAllClicked}>
            See all
          </span>
          <Conditional if={!isMobile}>
            <LTT_CHEVRON_LEFT onClick={goPrev} disabled={activeSlideIdx <= 0} />
            <LTT_CHEVRON_RIGHT
              onClick={goNext}
              disabled={activeSlideIdx + 6 >= sliderList.length}
            />
          </Conditional>
        </div>
      </TitleRow>
      <Swiper isFreeMode {...swiperParams}>
        {sliderList.map((tgid: number) => (
          <VerticalProductCard
            product={allTours[tgid]}
            key={tgid}
            isMobile={isMobile}
          />
        ))}
      </Swiper>
    </CategoryCarousel>
  );
};

const CategoryCarouselsSection = ({
  categoryProps,
  allTours,
  isMobile,
}: ICategoryCarouselsSection) => {
  const { categories } = categoryProps;
  const categoriesToRender: any[] = [];

  CATEGORIES_TO_SHOW_IN_ORDER.forEach((categoryName) => {
    const category = categories.find(
      ({ name }: { name: string }) => name === categoryName
    );
    if (category) categoriesToRender.push(category);
  });

  return (
    <CategoriesSectionWrapper>
      {categoriesToRender.map((category, categoryNumber) => {
        if (category.ranking.popularity.length === 0) return null;
        return (
          <>
            <CategoryCarouselSwiper
              key={categoryNumber}
              category={category}
              allTours={allTours}
              isMobile={isMobile}
              index={categoryNumber}
            />
          </>
        );
      })}
    </CategoriesSectionWrapper>
  );
};

export default CategoryCarouselsSection;
