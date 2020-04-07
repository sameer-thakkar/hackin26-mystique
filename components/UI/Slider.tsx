import React, { useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import Swiper from '../Swiper';
import Image from './Image';
import { COLORS } from '../../constants/ui-constants';

const StyledSlider = styled.div`
  display: flex;
  overflow: hidden;
  .slider-bullet {
    height: 7px;
    width: 7px;
    display: block;
    border-radius: 100%;
    cursor: pointer;
    background: ${COLORS.WHITE};
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

export const Slider = (props) => {
  const { images, carouselOptions, isMobile, nextButton, prevButton } = props;

  /* Swiper configration for using external controls starts here */
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
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
  /* Swiper configration for using external controls ends here */

  return (
    <StyledSlider>
      <Swiper {...carouselOptions} getSwiper={updateSwiper}>
        {images.map((image, index) => {
          return (
            <div key={index} className="swiper-slide">
              <Image
                height={isMobile ? 195 : 375}
                url={image?.url}
                alt={image.alt}
              />
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
              {prevButton}
            </div>
          ) : null}
          {!swiper?.isEnd ? (
            <div
              className="next-slide"
              role="button"
              tabIndex={0}
              onClick={goNext}
            >
              {nextButton}
            </div>
          ) : null}
        </Controls>
      ) : null}
    </StyledSlider>
  );
};

Slider.defaultProps = {
  carouselOptions: {
    direction: 'horizontal',
    speed: 650,
    navigaton: {
      nextEl: '.swiper-btn.btn-left',
      prevEl: '.swiper-btn.btn-right',
    },
    pagination: {
      el: '.slider-pagination',
      type: 'bullets',
      clickable: true,
      bulletClass: 'slider-bullet',
    },
  },
};
