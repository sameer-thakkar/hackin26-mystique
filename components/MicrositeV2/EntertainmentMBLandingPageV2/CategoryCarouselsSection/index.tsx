import { useContext, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import LazyComponent from 'components/common/LazyComponent';
import {
  TCategoryCarouselsSection,
  TCategoryCarouselSwiperProps,
} from 'components/MicrositeV2/EntertainmentMBLandingPageV2/CategoryCarouselsSection/interface';
import {
  CategoriesSectionWrapper,
  CategoryCarousel,
  LazyComponentWrapper,
  TitleRow,
} from 'components/MicrositeV2/EntertainmentMBLandingPageV2/CategoryCarouselsSection/styles';
import VerticalProductCard from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/VerticalProductCard';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  TEMP_HARDCODED_PRODUCT,
} from 'const/index';
import { strings } from 'const/strings';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);

export const CategoryCarouselSwiper = ({
  category,
  isMobile,
  allTours,
  index,
}: TCategoryCarouselSwiperProps) => {
  const { uid } = useContext(MBContext);

  let sliderList = isMobile
    ? category.ranking.popularity.slice(0, 10)
    : category.ranking.popularity;

  //temporary fix for hardcoded product, will be reverted
  if (
    TEMP_HARDCODED_PRODUCT.has(uid) &&
    category.id === TEMP_HARDCODED_PRODUCT.get(uid)?.SUBCAT_ID
  ) {
    const hardcodedTgid = TEMP_HARDCODED_PRODUCT.get(uid)?.TGID;
    sliderList = sliderList.filter((tgid: number) => tgid !== hardcodedTgid);
    sliderList.unshift(hardcodedTgid);
  }

  sliderList = Array.from(new Set(sliderList));

  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(6);
  const {
    ctaUrl: { link_type, url: seeAllUrl },
  } = category;

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
    if (isSectionIntersecting) {
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
      const newIndex = currIdx + slidesPerView;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Next',
        Category: category.name,
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          slidesPerView,
          sliderList?.length - newIndex
        ),
      });
    }
  };
  const goPrev = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx - slidesPerView;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Previous',
        Category: category.name,
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          slidesPerView,
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
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    onBreakpoint: (swiper, { slidesPerView }) => {
      if (swiper && slidesPerView && typeof slidesPerView === 'number') {
        setSlidesPerView(slidesPerView);
      }
    },
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
      1100: {
        slidesPerView: 6,
        spaceBetween: 24,
      },
    },
  };

  const handleSeaAllClicked = () => {
    if (category.name) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.SEE_ALL_CLICKED,
        [ANALYTICS_PROPERTIES.CATEGORY]: category.name,
      });
    }
  };

  if (!sliderList?.length) {
    return <></>;
  }

  return (
    <CategoryCarousel
      className="horizontally-aligned-child"
      key={category.id}
      ref={sectionRef}
    >
      <TitleRow className="title-row">
        <h2 className="title" id={category.name}>
          {category.name}
        </h2>
        <div className="controls">
          <Conditional if={link_type === 'Web' && seeAllUrl}>
            <a
              role="button"
              tabIndex={0}
              className="see-all"
              onClick={handleSeaAllClicked}
              href={seeAllUrl}
              target="_blank"
            >
              {strings.ENTERTAINMENT_MB_LANDING_PAGE.SEE_ALL}
            </a>
          </Conditional>
          <Conditional if={!isMobile && sliderList.length > slidesPerView}>
            <LttChevronLeft onClick={goPrev} disabled={activeSlideIdx <= 0} />
            <LttChevronRight
              onClick={goNext}
              disabled={activeSlideIdx + slidesPerView >= sliderList.length}
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
  categoriesToRender,
  allTours,
  isMobile,
  isCategoryPage = false,
}: TCategoryCarouselsSection) => {
  return (
    <CategoriesSectionWrapper $isCategoryPage={isCategoryPage}>
      {categoriesToRender.map((category, categoryNumber) => {
        if (category.ranking.popularity.length === 0) return null;
        return (
          <LazyComponentWrapper id={category.name} key={categoryNumber}>
            <LazyComponent
              options={{
                rootMargin: '-50px',
                threshold: 0.01,
              }}
            >
              <CategoryCarouselSwiper
                category={category}
                allTours={allTours}
                isMobile={isMobile}
                index={categoryNumber}
              />
            </LazyComponent>
          </LazyComponentWrapper>
        );
      })}
    </CategoriesSectionWrapper>
  );
};

export default CategoryCarouselsSection;
