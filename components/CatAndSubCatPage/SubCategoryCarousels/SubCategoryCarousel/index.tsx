import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import CollectionCard from 'components/CatAndSubCatPage/CollectionCard';
import { SubCategoryCarouselProps } from 'components/CatAndSubCatPage/SubCategoryCarousels/SubCategoryCarousel/interface';
import {
  CarouselControls,
  HeadingContainer,
  SectionHeading,
  SubCategoryCarouselContainer,
} from 'components/CatAndSubCatPage/SubCategoryCarousels/SubCategoryCarousel/styles';
import {
  handleCarouselControlTracking,
  trackCTA,
  trackPageSection,
} from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { CAROUSEL_DIR, CTA_TYPE } from 'const/index';
import { strings } from 'const/strings';
import { LTT_CHEVRON_LEFT, LTT_CHEVRON_RIGHT } from 'assets/SvgIcons';

const Swiper = dynamic(() =>
  import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);
const OverflowScroll = dynamic(() =>
  import(/* webpackChunkName: "OverflowScroll" */ 'UI/OverflowScroll')
);

const SubCategoryCarousel: React.FC<SubCategoryCarouselProps> = (props) => {
  const { heading, name, subCategoryPageUrl, carouselData, isMobile } = props;
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useOnScreen({ ref: sectionRef, unobserve: true });

  useEffect(() => {
    if (isIntersecting) {
      trackPageSection({ section: name });
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
      section: name,
      direction: CAROUSEL_DIR.NEXT,
    });
  };

  const goPrev = () => {
    if (!swiper) return;
    swiper.slidePrev();
    handleCarouselControlTracking({
      section: name,
      direction: CAROUSEL_DIR.PREV,
    });
  };

  const swiperParams: SwiperProps = {
    slidesPerView: 4,
    spaceBetween: 24,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onTouchEnd: () => {},
    onSlideChange: () => updateIndex(),
  };

  const Carousel = carouselData.map((carouselCard, index) => {
    const { id } = carouselCard;
    return (
      <CollectionCard
        key={id}
        ranking={index}
        {...carouselCard}
        isSubCategoryPage={false}
        sectionName={name}
        isMobile={isMobile}
      />
    );
  });

  return (
    <SubCategoryCarouselContainer
      className={name.toLowerCase().replace(' ', '-')}
      ref={sectionRef}
    >
      <HeadingContainer>
        <SectionHeading>{heading}</SectionHeading>
        <Conditional if={subCategoryPageUrl}>
          <span className="see-all-cta">
            <a
              href={subCategoryPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) =>
                trackCTA({
                  event: e,
                  url: subCategoryPageUrl,
                  section: name,
                  ctaType: CTA_TYPE.SEE_ALL,
                })
              }
            >
              {strings.SEE_ALL}
            </a>
          </span>
        </Conditional>
        <Conditional if={(!swiper?.isBeginning || !swiper?.isEnd) && !isMobile}>
          <CarouselControls>
            <span className="prev-pill">
              <LTT_CHEVRON_LEFT
                onClick={goPrev}
                disabled={swiper?.isBeginning}
                aria-label={`See previous`}
                aria-disabled={swiper?.isBeginning}
              />
            </span>
            <span className="next-pill">
              <LTT_CHEVRON_RIGHT
                onClick={goNext}
                disabled={swiper?.isEnd}
                aria-label={`See more`}
                aria-disabled={swiper?.isEnd}
              />
            </span>
          </CarouselControls>
        </Conditional>
      </HeadingContainer>
      <div>
        <Conditional if={!isMobile}>
          <Swiper {...swiperParams}>{Carousel}</Swiper>
        </Conditional>
        <Conditional if={isMobile}>
          <OverflowScroll
            unsetWrapperMargin={true}
            unsetChildrenMargin={true}
            unsetChildrenPadding={true}
            gap={0.75}
          >
            {Carousel}
          </OverflowScroll>
        </Conditional>
      </div>
    </SubCategoryCarouselContainer>
  );
};

export default SubCategoryCarousel;
