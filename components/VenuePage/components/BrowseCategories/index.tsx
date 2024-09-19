import { useState } from 'react';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import Swiper from 'components/Swiper';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';
import { TBrowseCategories } from './interface';
import {
  Arrows,
  IconContainer,
  Navigation,
  PillIcon,
  Tile,
  Title,
  Wrapper,
} from './styles';

const SWIPER_BREAKPOINTS = {
  768: {
    slidesPerView: 4,
  },
  1024: {
    slidesPerView: 5,
  },
  1440: {
    slidesPerView: 6,
  },
};

const BrowseByCategories = ({ data, isMobile }: TBrowseCategories) => {
  const { subCategoriesData } = data ?? [];
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);

  const { THEATRE_LANDING_PAGE } = strings;
  const { CATEGORIES } = THEATRE_LANDING_PAGE;

  const swiperParams: SwiperProps = {
    className: '.more-reads-swiper',
    spaceBetween: isMobile ? 15 : 24,
    loop: !isMobile,
    slidesPerView: 'auto',
    allowTouchMove: true,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
  };

  const goNext = () => {
    if (!swiper) return;
    swiper.slideNext();
  };

  const goPrev = () => {
    if (!swiper) return;
    swiper.slidePrev();
  };

  return (
    <Conditional if={subCategoriesData?.length > 0}>
      <Wrapper>
        <Title>
          {CATEGORIES}
          <Conditional if={!isMobile}>
            <Navigation>
              <Arrows>
                <div className="icons">
                  <LttChevronLeft
                    onClick={goPrev}
                    disabled={swiper?.isBeginning}
                  />
                  <LttChevronRight onClick={goNext} disabled={swiper?.isEnd} />
                </div>
              </Arrows>
            </Navigation>
          </Conditional>
        </Title>
        <Swiper {...swiperParams} breakpoints={SWIPER_BREAKPOINTS}>
          {subCategoriesData?.map(
            ({ subCategoryUrl, imageUrl, localisedScName, svgIcon }: any) => {
              return (
                <Tile
                  key={localisedScName}
                  href={subCategoryUrl}
                  target="_blank"
                >
                  <Image
                    url={imageUrl}
                    height={104}
                    width={178}
                    alt={localisedScName}
                    className="subcategory-image"
                    loadHigherQualityImage={true}
                  />
                  <IconContainer>
                    <PillIcon $iconUrl={svgIcon} />
                  </IconContainer>
                  <p>{localisedScName}</p>
                </Tile>
              );
            }
          )}
        </Swiper>
      </Wrapper>
    </Conditional>
  );
};

export default BrowseByCategories;
