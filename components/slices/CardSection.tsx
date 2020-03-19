import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';
import useWindowSize from '../hooks/useWindowSize';
import Swiper from '../Swiper';
import OverflowScroll from '../UI/OverflowScroll';
import { CHEVRON_LEFT_CIRCLE } from '../../public/static/svg-icons';

const StyledCardSection = styled.div(({ cardType, isMobile }) => {
  let gridTemplateColumns = `100%`;
  if (cardType === 'column') {
    gridTemplateColumns = `50% 50%`;
  } else if (cardType === 'mobile' && !isMobile) {
    gridTemplateColumns = `repeat(4, calc(25% - 15px))`;
  }
  return `
    display: grid;
    grid-template-columns: ${gridTemplateColumns};
    grid-gap: 20px;
`;
});

const StyledSwiper = styled.div`
  display: flex;
  position: relative;
  .cards-section-wrapper {
    display: grid;
    grid-auto-flow: column;
    padding: 25px 0;
  }
  .prev-slide,
  .next-slide {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -20px;
    cursor: pointer;
    z-index: 5;
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

type CardSectionProps = {
  slices: any[];
  cardType: string;
  sectionType: string;
  title?: string;
};

/**
 * A card section displaying different types of Cards in a gird.
 *
 * This is a special kind of slice. To use follow below instructions:
 *
 * You have to first insert a 'Card Section Start' slice with the following fields:
 *
 * ### Non-repeatable zone
 * - Card Section Title
 * - Card Section Type
 * - Card Type
 *
 * ### Repeatable zone
 * Nil.
 *
 * After this, keep adding intermediate Card slices to your needs and then close the Section with a 'Card Section End' slice.
 */

const CardSection: React.FC<CardSectionProps> = ({
  slices,
  cardType,
  sectionType,
  title,
}) => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    setIsMobile(width <= 760);
  }, [width, setIsMobile]);

  let finalCardType = cardType;

  // Display desktop card if only 1 slice is available
  if (slices.length === 1) finalCardType = 'desktop';

  // Display a grid style if card type is mobile and no. of card are <= 4
  if (finalCardType === 'mobile' && !isMobile) {
    if (slices.length <= 4) {
      sectionType = 'Grid';
    }
  }

  let cards = slices.map((slice, index) => {
    return sliceHandler(slice, { cardType: finalCardType, index });
  });

  // Carousel (and Overflow Scroll for mobile) Logic
  if (sectionType === 'Carousel' && !isMobile) {
    let slidesPerView = 1;
    switch (cardType) {
      case 'column':
        slidesPerView = 2;
        break;
      case 'mobile':
        slidesPerView = 4;
      default:
        break;
    }

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

    const updateIndex = useCallback(
      () => updateCurrentIndex(swiper.realIndex),
      [swiper]
    );

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

    const swiperParams = {
      slidesPerView,
      wrapperClass: 'cards-section-wrapper',
      spaceBetween: 20,
      getSwiper: updateSwiper,
    };

    return (
      <>
        {title ? <h2>{title}</h2> : null}
        <StyledSwiper>
          <Swiper {...swiperParams}>
            {cards.map((card, index) => {
              return (
                <div key={index} className="swiper-slide">
                  {card}
                </div>
              );
            })}
          </Swiper>
          <div className="controls">
            {!swiper?.isBeginning ? (
              <div className="prev-slide" onClick={goPrev}>
                {CHEVRON_LEFT_CIRCLE}
              </div>
            ) : null}
            {!swiper?.isEnd ? (
              <div className="next-slide" onClick={goNext}>
                {CHEVRON_LEFT_CIRCLE}
              </div>
            ) : null}
          </div>
        </StyledSwiper>
      </>
    );
  }

  if (sectionType === 'Carousel' && isMobile) {
    return (
      <>
        {title ? <h2>{title}</h2> : null}
        <OverflowScroll>{cards}</OverflowScroll>
      </>
    );
  }

  return (
    <>
      {title ? <h2>{title}</h2> : null}
      <StyledCardSection
        cardType={finalCardType}
        sectionType={sectionType}
        isMobile={isMobile}
      >
        {cards}
      </StyledCardSection>
    </>
  );
};

export default CardSection;
