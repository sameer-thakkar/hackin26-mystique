import React, { useMemo, useState } from 'react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import ArrowButton from 'components/Espeon/Common/CustomSwiper/Arrows';
import MediaCarousel from 'UI/MediaCarousel';
import { Paginator } from 'UI/Paginator';
import COLORS from 'const/colors';
import { CAROUSEL_UNITS } from 'const/index';
import { collectionHeaderBannerRecipe } from './styles';

const CollectionHeaderBanner = (props: any) => {
  const { images = [], onSlideChanged, isMobile } = props;
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const imageList = useMemo(() => {
    return images.map(({ url, alt }: { url: string; alt: string }) => ({
      url,
      altText: alt!,
    }));
  }, [images]);

  const onPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev();
      onSlideChanged?.({ direction: 'previous' });
    }
  };

  const onNext = () => {
    if (swiper !== null) {
      swiper.slideNext();
      onSlideChanged?.({ direction: 'next' });
    }
  };

  if (imageList.length === 0) return null;

  const styles = collectionHeaderBannerRecipe({ isMobile });

  return (
    <div className={styles.root}>
      <MediaCarousel
        imageList={imageList}
        backgroundColor={COLORS.GRAY.G7}
        imageAspectRatio="16:10"
        imageWidth={400}
        showPagination={false}
        isMobile={isMobile}
        enableAutoplay={imageList.length > 1}
        isTimed={true}
        trackImage={false}
        showTimedPaginator={isMobile}
        shouldCrop
        showNavigation={false}
        disableOnInteraction={false}
        differentBorderRadiusForMobile={false}
        onSwiper={(swiper: TSwiper) => {
          setSwiperInstance(swiper);
        }}
        onSlideChange={(swiper: TSwiper) => {
          setCurrentIndex(swiper.realIndex);
        }}
      />
      <Conditional if={imageList.length > 1 && !isMobile}>
        <div className={styles.navigation}>
          <ArrowButton direction="previous" onArrowClicked={onPrev} />
          <Paginator
            tabSize={1.5}
            dotSize={6 / 16}
            totalCount={imageList.length}
            activeIndex={currentIndex}
            limit={4}
            activeSlideTimer={5000}
            size={12 / 16}
            margin={2 / 16}
            inactiveColor={`${COLORS.GRAY.G4}66`}
            activeColor={COLORS.GRAY.G4}
            containerWidthOverride={
              (CAROUSEL_UNITS.dotsLimit - 1) *
                (CAROUSEL_UNITS.mobileDotSize +
                  2 * CAROUSEL_UNITS.mobileDotMargin) +
              (CAROUSEL_UNITS.mobileTabSize +
                2 * CAROUSEL_UNITS.mobileTabMargin)
            }
            enableTranslate={true}
            enableCompletedColor={true}
          />
          <ArrowButton direction="next" onArrowClicked={onNext} />
        </div>
      </Conditional>
    </div>
  );
};

export default CollectionHeaderBanner;
