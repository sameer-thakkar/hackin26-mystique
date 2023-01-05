import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import Conditional from 'components/common/Conditional';
import OverflowScroll from 'UI/OverflowScroll';
import { SIZES } from 'const/ui-constants';
import COLORS from 'const/colors';
import { CHEVRON_LEFT_CIRCLE } from 'assets/SvgIcons';

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
    ${({ marginBottom }) => marginBottom && `margin-bottom: ${marginBottom}px;`}
  }
  .swiper-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
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
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const updateIndex = useCallback(() => updateCurrentIndex(swiper.realIndex), [
    swiper,
  ]);

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  useEffect(() => {
    if (isMobile) return;
    if (swiper !== null) {
      swiper.on('slideChange', updateIndex);
    }

    return () => {
      if (swiper !== null) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex]);

  if (!isMobile) {
    const goNext = () => {
      if (swiper !== null) {
        swiper.slideNext();
      }
    };

    const goPrev = () => {
      if (swiper !== null) {
        swiper.slidePrev();
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
          <StyledSwiper columnGap={columnGap} marginBottom={marginBottom}>
            <Swiper {...swiperParams}>{children}</Swiper>
          </StyledSwiper>
          <Controls>
            <Conditional if={swiper && !swiper?.isBeginning}>
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={goPrev}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
            <Conditional if={swiper && !swiper?.isEnd}>
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
          </Controls>
        </StyledCarousel>
      </div>
    );
  }
  if (isMobile) {
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
