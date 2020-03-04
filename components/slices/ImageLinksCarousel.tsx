import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Swiper from '../Swiper';
import Image from '../UI/Image';
import { CHEVRON_LEFT } from '../../public/static/svg-icons';
import { shortCodeSerializer } from '../../utils/shortCodes';
import { AVENIR, COLORS } from '../../constants/ui-constants';

const StyledWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 16px;
`;

const StyledMobileSlider = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-gap: 12px;
  overflow: scroll;
  margin: 0 -16px;
  padding: 0 16px;
  last-child {
    margin-right: 16px;
  }
`;

const StyledContent = styled.div`
  h2 {
    margin: 0;
    margin-bottom: 8px;
    font-family: ${AVENIR.FONT_STACK};
    font-size: 24px !important;
    line-height: 33px;
    font-weight: ${AVENIR.HEAVY};
    color: ${COLORS.TWO_BLACK};
  }
  div {
    margin: 0;
    margin-bottom: 16px;
    font-family: ${AVENIR.FONT_STACK};
    font-size: 14px;
    line-height: 20px;
    color: ${COLORS.FOUR_BLACK};
    p {
      margin: 0;
    }
  }
  @media (max-width: 768px) {
    h2 {
      line-height: 26px;
    }
    div {
      line-height: 20px;
      margin-bottom: 8px;
    }
  }
`;

const StyledSlider = styled.div`
  display: grid;
  position: relative;
  grid-auto-flow: column;
  .slider-container {
    overflow: hidden;
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: auto;
  }
  .controls {
    display: flex;
  }
  .controls .btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -32px;
    display: flex;
    cursor: pointer;
  }
  .controls .btn svg {
    stroke-width: 1.5px;
  }
  .controls .btn-right {
    left: unset;
    right: -32px;
  }
  .controls .btn-right svg {
    transform: rotate(180deg);
  }
`;

const StyledSlide = styled.div`
  margin-right: 20px;
  img {
    height: 175px;
    width: 290px !important;
    border-radius: 4px;
  }
  div {
    font-family: ${AVENIR.FONT_STACK};
    font-size: 16px;
    font-weight: ${AVENIR.HEAVY};
    color: ${COLORS.TWO_BLACK};
    margin-top: 4px;
  }
  @media (max-width: 768px) {
    margin-right: 0px;
    img {
      width: 104px !important;
      height: 60px;
    }
    div {
      font-size: 14px;
    }
  }
`;

const Slide = props => (
  <StyledSlide>
    <a href={props.link.url} target={props.link.target}>
      <Image
        dontLazyLoad={!props.lazyLoad}
        url={props.image.url}
        alt={props.image.alt}
      />
    </a>
    <div>{props.card_title}</div>
  </StyledSlide>
);

type ImageLinksCarouselProps = {
  isMobile: boolean;
  cards: any[];
  heading: string;
  description: any[];
  lazyLoadImages?: boolean;
};

/**
 *
 * A gallery like image carousel with mini titles for each image and a link wrapped over
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - *Carousel Heading
 * - Carousel Description
 *  - Rich Text field
 *
 * ### Repeatable zone
 * - Uploaded Image
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Link to Image
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 * - Card Link
 * - Card Title
 *
 * **Note: Either 'Uploaded Image' or 'Link to Image' is required and if left blank will break the slice**
 */

const ImageLinksCarousel: React.FC<ImageLinksCarouselProps> = props => {
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
    if (isMobile) return;
    if (swiper !== null) {
      swiper.on('slideChange', updateIndex);
    }

    return () => {
      if (swiper !== null) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [swiper, updateIndex]);

  const {
    cards,
    heading,
    description,
    isMobile,
    lazyLoadImages = true,
  } = props;

  const swiperParams = {
    slidesPerGroup: 4,
    direction: 'horizontal',
    speed: 650,
    slidesPerView: 4,
    spaceBetween: 24,
    rebuildOnUpdate: false,
    navigaton: {
      nextEl: '.swiper-btn.btn-left',
      prevEl: '.swiper-btn.btn-right',
    },
  };

  return (
    <StyledWrapper>
      <StyledContent>
        <h2>{heading}</h2>
        <div>
          <RichText render={description} htmlSerializer={shortCodeSerializer} />
        </div>
      </StyledContent>
      {isMobile ? (
        <StyledMobileSlider>
          {cards.map((card, index) => (
            <Slide key={index} {...card} lazyLoad={lazyLoadImages} />
          ))}
        </StyledMobileSlider>
      ) : (
        <StyledSlider>
          <div className="slider-container">
            <Swiper {...swiperParams} getSwiper={updateSwiper}>
              {cards.map((card, index) => (
                <Slide key={index} {...card} lazyLoad={lazyLoadImages} />
              ))}
            </Swiper>
          </div>
          <div className="controls">
            {swiper && !swiper.isBeginning ? (
              <div className="swiper-btn btn btn-left" onClick={goPrev}>
                {CHEVRON_LEFT}
              </div>
            ) : null}
            {swiper && !swiper.isEnd ? (
              <div className="swiper-btn btn btn-right" onClick={goNext}>
                {CHEVRON_LEFT}
              </div>
            ) : null}
          </div>
        </StyledSlider>
      )}
    </StyledWrapper>
  );
};

export default ImageLinksCarousel;
