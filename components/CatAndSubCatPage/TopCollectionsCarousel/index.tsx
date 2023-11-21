import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import { TopCollectionsCarouselProps } from 'components/CatAndSubCatPage/TopCollectionsCarousel/interface';
import {
  CarouselControls,
  HeadingContainer,
  SectionHeading,
  TopCollectionsCarouselContainer,
  TopCollectionsCarouselSection,
} from 'components/CatAndSubCatPage/TopCollectionsCarousel/styles';
import TopCollectionCard from 'components/CatAndSubCatPage/TopCollectionsCarousel/TopCollectionCard';
import {
  handleCarouselControlTracking,
  trackPageSection,
} from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { getCatAndSubcatPageLabel } from 'utils/helper';
import { SECTIONS } from 'const/catAndSubcatPage';
import { CAROUSEL_DIR, MB_CATEGORISATION } from 'const/index';
import { strings } from 'const/strings';
import { LTT_CHEVRON_LEFT, LTT_CHEVRON_RIGHT } from 'assets/SvgIcons';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);
const OverflowScroll = dynamic(() =>
  import(/* webpackChunkName: "OverflowScroll" */ 'UI/OverflowScroll')
);

const TopCollectionsCarousel: React.FC<TopCollectionsCarouselProps> = (
  props
) => {
  const { topCollectionsCarousel, categoryData, isMobile } = props;

  const sectionHeading = getCatAndSubcatPageLabel({
    label: 'TOP_CATEGORY',
    replacementString:
      categoryData?.displayName === MB_CATEGORISATION.CATEGORY.TICKETS
        ? strings.CAT_SUBCAT_PAGE.ATTRACTIONS
        : categoryData?.displayName,
  });
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useOnScreen({ ref: sectionRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({
        section: SECTIONS.TOP_CATEGORY,
      });
    }
  }, [isIntersecting]);

  const updateIndex = useCallback(() => {
    if (isMobile || !swiper) return;
    setActiveIndex(swiper.realIndex);
  }, [swiper, isMobile]);

  const goNext = () => {
    if (!swiper) return;
    swiper.slideNext();
    handleCarouselControlTracking({
      direction: CAROUSEL_DIR.NEXT,
      section: SECTIONS.TOP_CATEGORY,
    });
  };

  const goPrev = () => {
    if (!swiper) return;
    swiper.slidePrev();
    handleCarouselControlTracking({
      direction: CAROUSEL_DIR.PREV,
      section: SECTIONS.TOP_CATEGORY,
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
    spaceBetween: 16,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onTouchEnd: () => {},
    onSlideChange: () => updateIndex(),
  };

  const TopCollections = topCollectionsCarousel.map((topCollection, index) => {
    const { id } = topCollection;
    return (
      <TopCollectionCard
        key={id}
        ranking={index}
        {...topCollection}
        isMobile={isMobile}
      />
    );
  });

  return (
    <TopCollectionsCarouselSection ref={sectionRef}>
      <TopCollectionsCarouselContainer>
        <HeadingContainer>
          <SectionHeading>{sectionHeading}</SectionHeading>
          <Conditional
            if={(!swiper?.isBeginning || !swiper?.isEnd) && !isMobile}
          >
            <CarouselControls>
              <span className="prev-pill">
                <LTT_CHEVRON_LEFT
                  onClick={goPrev}
                  disabled={swiper?.isBeginning}
                  aria-label={`See previous ${sectionHeading?.toLowerCase()}`}
                  aria-disabled={swiper?.isBeginning}
                />
              </span>
              <span className="next-pill">
                <LTT_CHEVRON_RIGHT
                  onClick={goNext}
                  disabled={swiper?.isEnd}
                  aria-label={`See more ${sectionHeading?.toLowerCase()}`}
                  aria-disabled={swiper?.isEnd}
                />
              </span>
            </CarouselControls>
          </Conditional>
        </HeadingContainer>
        <div>
          <Conditional if={!isMobile}>
            <Swiper {...swiperParams}>{TopCollections}</Swiper>
          </Conditional>
          <Conditional if={isMobile}>
            <OverflowScroll
              unsetWrapperMargin={true}
              unsetChildrenMargin={true}
              unsetChildrenPadding={true}
              gap={0.75}
            >
              {TopCollections}
            </OverflowScroll>
          </Conditional>
        </div>
      </TopCollectionsCarouselContainer>
    </TopCollectionsCarouselSection>
  );
};

export default TopCollectionsCarousel;
