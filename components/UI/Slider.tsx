import React, { useEffect, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { useAmp } from 'next/amp';
import { CHEVRON_LEFT } from 'assets/SvgIcons';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const StyledSlider = styled.div`
  display: flex;
  position: relative;
  ${({ parentOverflowHidden }) =>
    parentOverflowHidden ? 'overflow: hidden;' : ''}
  .slider-bullet {
    height: 7px;
    width: 7px;
    display: block;
    border-radius: 100%;
    cursor: pointer;
    background: ${COLORS.BRAND.WHITE};
    opacity: 0.6;
  }
  .slider-bullet.swiper-pagination-bullet-active {
    opacity: 1;
    height: 10px;
    width: 10px;
  }
  .swiper-container {
    width: 100%;
    height: max-content;
  }
  .slider-pagination {
    z-index: 10;
    justify-content: center;
    align-items: center;
    grid-gap: 8px;
    position: absolute;
    display: grid;
    grid-auto-flow: column;
  }
  @media (max-width: 768px) {
    height: max-content;
    .swiper-wrapper {
      height: max-content;
    }
    .swiper-container {
      width: 100%;
      height: auto;
    }
    .slider-bullet {
      height: 6px;
      width: 6px;
    }
    .slider-bullet.swiper-pagination-bullet-active {
      height: 8px;
      width: 8px;
    }
  }
`;

const Controls = styled.div`
  .prev-slide,
  .next-slide {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -10px;
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
    right: 10px;
    svg {
      transform: rotate(180deg);
    }
  }
`;

const Slider: React.FC<{
  children: React.ReactChild[];
  sliderOptions?: any;
  nextButton?: React.ReactElement;
  prevButton?: React.ReactElement;
  parentOverflowHidden?: boolean;
  paginationClass?: string;
}> = ({
  children,
  sliderOptions,
  nextButton,
  prevButton,
  parentOverflowHidden = false,
  paginationClass,
}) => {
    /* Swiper configuration for using external controls starts here */
    const [swiper, updateSwiper] = useState(null);
    const [currentIndex, updateCurrentIndex] = useState(0);
    const isAmp = useAmp();
    const goToSlide = (index) => {
      if (swiper !== null) {
        swiper.slideTo(index);
      }
    };

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

    const updateIndex = useCallback(() => updateCurrentIndex(swiper.realIndex), [
      swiper,
    ]);

    useEffect(() => {
      if (swiper && swiper !== null) {
        swiper.on('slideChange', updateIndex);
      }

      return () => {
        if (swiper && swiper !== null) {
          swiper.off('slideChange', updateIndex);
        }
      };
    }, [swiper, updateIndex]);
    /* Swiper configuration for using external controls ends here */

    return (
      <StyledSlider parentOverflowHidden={parentOverflowHidden}>
        <Swiper {...sliderOptions} getSwiper={updateSwiper}>
          {children.map((child, index) => {
            return (
              <div className="swiper-slide" key={index}>
                {child}
              </div>
            );
          })}
        </Swiper>
        {nextButton && prevButton ? (
          <Controls>
            {!swiper?.isBeginning ? (
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={goPrev}
              >
                {isAmp ? CHEVRON_LEFT : prevButton}
              </div>
            ) : null}
            {!swiper?.isEnd ? (
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {isAmp ? CHEVRON_LEFT : nextButton}
              </div>
            ) : null}
          </Controls>
        ) : null}
        {paginationClass ? (
          <div
            className={`${paginationClass} slider-pagination swiper-pagination-clickable swiper-pagination-bullets`}
          >
            {children.map((item, index) => {
              return (
                <span
                  key={index}
                  className={`slider-bullet ${index === currentIndex
                      ? 'swiper-pagination-bullet-active'
                      : ''
                    }`}
                  tabIndex={0}
                  role="button"
                  onClick={() => {
                    goToSlide(index);
                  }}
                  aria-label={`Go to slide ${index}`}
                />
              );
            })}
          </div>
        ) : null}
      </StyledSlider>
    );
  };

export default Slider;
