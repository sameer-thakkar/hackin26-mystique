import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import Conditional from 'components/common/Conditional';
import OverflowScroll from 'UI/OverflowScroll';
import { SIZES, HALYARD } from 'const/ui-constants';
import { CHEVRON_LEFT_CIRCLE } from 'assets/SvgIcons';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const StyledCarousel = styled.div`
  position: relative;

  .swiper-initialized {
    width: 100%;
  }
`;

const StyledSwiper = styled.div`
  overflow: hidden;
  display: flex;
  position: relative;
  max-width: ${SIZES.MAX_WIDTH};
  .swiper-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    margin-bottom: 24px;
  }
`;

const Controls = styled.div`
  .prev-slide,
  .next-slide {
    position: absolute;
    top: 100px;
    transform: translateY(-50%);
    left: -20px;
    cursor: pointer;
    z-index: 2;
    svg {
      fill: #fff;
      circle {
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
      }
      border-radius: 100%;
      box-shadow: path {
        stroke-width: 2px;
      }
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

const EntrySection = styled.div`
  margin-bottom: 32px;
  font-family: ${HALYARD.FONT_STACK};
  @media (max-width: 500px) {
    margin-bottom: 24px;
  }
`;

interface CarouselProps {
  cardsInARow?: number;
  spaceBetween?: number;
  entrySection?: JSX.Element;
  children?: any[];
}

// @ts-expect-error TS(2322): Type '({ cardsInARow, spaceBetween, entrySection, ... Remove this comment to see the full error message
const Carousel: FunctionComponent<CarouselProps> = ({
  cardsInARow = 1,
  spaceBetween = 24,
  entrySection,
  children,
}) => {
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(false);
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const updateIndex = useCallback(() => updateCurrentIndex(swiper.realIndex), [
    swiper,
  ]);

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  useEffect(() => {
    if (isMobile)
        return;
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
      spaceBetween: spaceBetween,
      shouldSwiperUpdate: true,
      onSwiper: updateSwiper,
    };

    return (<div>
        <EntrySection>{entrySection}</EntrySection>
        <StyledCarousel>
          <StyledSwiper>
            {/* @ts-expect-error TS(2745): This JSX tag's 'children' prop expects type 'React... Remove this comment to see the full error message */}
            <Swiper {...swiperParams}>{children}</Swiper>
          </StyledSwiper>
          <Controls>
            <Conditional if={!(swiper as any)?.isBeginning}>
              <div className="prev-slide" role="button" tabIndex={0} onClick={goPrev}>
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
            <Conditional if={!(swiper as any)?.isEnd}>
              <div className="next-slide" role="button" tabIndex={0} onClick={goNext}>
                {CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
          </Controls>
        </StyledCarousel>
      </div>);
  }
  if (isMobile) {
    return (
      <>
        <Conditional if={entrySection}>
          <EntrySection>{entrySection}</EntrySection>
        </Conditional>
        {/* @ts-expect-error TS(2745): This JSX tag's 'children' prop expects type 'React... Remove this comment to see the full error message */}
        <OverflowScroll minWidthChild="calc(100vw - 93px)" marginBottom={0}>
          {children}
        </OverflowScroll>
      </>
    );
  }
};
export default Carousel;
