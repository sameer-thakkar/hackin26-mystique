import Image from '../UI/Image';
import styled from 'styled-components';
import Swiper from '../Swiper';
import {
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
  useRef,
} from 'react';
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

export const Slider = props => {
  const { images, carouselOptions, rebuildOnUpdate } = props;
  carouselOptions.rebuildOnUpdate = rebuildOnUpdate;
  const [swiper, updateSwiper] = useState(null);
  const [currentIndex, updateCurrentIndex] = useState(0);
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
  }, [swiper, currentIndex]);
  return (
    <StyledSlider>
      <Swiper {...carouselOptions} getSwiper={updateSwiper}>
        {images.map((image, index) => {
          return (
            <div key={index} className="swiper-slide">
              <Image dontLazyLoad={true} url={image?.url} alt={image.alt} />
            </div>
          );
        })}
      </Swiper>
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
