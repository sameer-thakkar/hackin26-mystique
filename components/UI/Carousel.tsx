import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import type { Swiper as SwiperClass } from 'swiper';
import Conditional from 'components/common/Conditional';
import OverflowScroll from 'UI/OverflowScroll';
import COLORS from 'const/colors';
import { SIZES } from 'const/ui-constants';
import ChevronLeftCircle from 'assets/chevronLeftCircle';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const StyledCarousel = styled.div`
  position: relative;
`;

const StyledSwiper = styled.div`
  display: flex;
  position: relative;
  max-width: ${SIZES.MAX_WIDTH};
  width: 100%;
  .swiper-initialized {
    width: 100%;
    margin: auto;
    overflow: hidden;
    ${({
      // @ts-expect-error TS(2339): Property 'marginBottom' does not exist on type 'Pi... Remove this comment to see the full error message
      marginBottom,
    }) => marginBottom && `margin-bottom: ${marginBottom}px;`}
  }
  .swiper-wrapper {
    height: 100%;
  }
  .swiper-slide {
    height: 100%;
  }
`;

const Controls = styled.div`
  .prev-slide,
  .next-slide {
    position: absolute;
    top: 150px;
    transform: translateY(-50%);
    left: -20px;
    cursor: pointer;
    z-index: 2;
    svg {
      fill: ${COLORS.BRAND.WHITE};
      circle {
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
      }
      border-radius: 100%;
    }
  }
  .next-slide {
    left: unset;
    right: -20px;
    svg {
      transform: rotate(180deg);
    }
  }
`;

type CarouselProps = {
  cardsInARow: number;
  columnGap: number;
  children: any;
  slidesPerGroup?: number;
  marginBottom?: number;
};

const Carousel = ({
  cardsInARow,
  columnGap,
  children,
  slidesPerGroup = 1,
  marginBottom,
}: CarouselProps) => {
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(false);
  const [swiper, updateSwiper] = useState<SwiperClass | null>(null);
  const [_currentIndex, updateCurrentIndex] = useState<number | undefined>(0);
  const updateIndex = useCallback(
    () => updateCurrentIndex(swiper?.realIndex),
    [swiper]
  );

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  useEffect(() => {
    if (isMobile) return;
    if (swiper !== null) {
      (swiper as any).on('slideChange', updateIndex);
    }
    return () => {
      if (swiper !== null) {
        (swiper as any).off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex]);

  if (!isMobile) {
    const goNext = () => {
      if (swiper !== null) {
        (swiper as any).slideNext();
      }
    };

    const goPrev = () => {
      if (swiper !== null) {
        (swiper as any).slidePrev();
      }
    };

    const swiperParams = {
      slidesPerView: cardsInARow,
      spaceBetween: columnGap,
      shouldSwiperUpdate: true,
      onSwiper: updateSwiper,
      slidesPerGroup,
      autoHeight: true,
    };

    return (
      <div>
        <StyledCarousel>
          {/* @ts-expect-error TS(2769): No overload matches this call. */}
          <StyledSwiper columnGap={columnGap} marginBottom={marginBottom}>
            {/* @ts-expect-error TS(2322): Type '{ children: any; slidesPerView: number; spac... Remove this comment to see the full error message */}
            <Swiper onSwiper={(s) => s} {...swiperParams}>
              {children}
            </Swiper>
          </StyledSwiper>
          <Controls>
            <Conditional if={swiper && !(swiper as any)?.isBeginning}>
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={goPrev}
              >
                {ChevronLeftCircle}
              </div>
            </Conditional>
            <Conditional if={swiper && !(swiper as any)?.isEnd}>
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {ChevronLeftCircle}
              </div>
            </Conditional>
          </Controls>
        </StyledCarousel>
      </div>
    );
  } else {
    return (
      <>
        <OverflowScroll minWidthChild="calc(100vw - 93px)" marginBottom={0}>
          {children}
        </OverflowScroll>
      </>
    );
  }
};
export default Carousel;
