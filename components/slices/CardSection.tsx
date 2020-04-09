import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';
import useWindowSize from '../hooks/useWindowSize';
import Swiper from '../Swiper';
import OverflowScroll from '../UI/OverflowScroll';
import RichContent from '../UI/RichContent';
import TitleTextCombo from '../UI/TitleTextCombo';
import { CHEVRON_LEFT_CIRCLE } from '../../public/static/svg-icons';

const CardGrid = styled.div(({ noOfCards, cardType, isMobile }) => {
  let gridTemplateColumns = `100%`;
  if (cardType === 'column') {
    gridTemplateColumns = `50% 50%`;
  } else if (cardType === 'mobile' && !isMobile) {
    if (noOfCards < 4) {
      gridTemplateColumns = `repeat(${noOfCards}, calc(${
        100 / noOfCards
      }% - 15px))`;
    } else {
      gridTemplateColumns = `repeat(4, calc(25% - 15px))`;
    }
  }
  return `
    display: grid;
    grid-template-columns: ${gridTemplateColumns};
    grid-gap: 20px;
`;
});

const CardCarousel = styled.div`
  position: relative;
`;

const StyledSwiper = styled.div`
  overflow: hidden;
  display: flex;
  position: relative;
  .cards-section-wrapper {
    display: grid;
    grid-auto-flow: column;
    padding: 25px 0;
  }
`;

const Controls = styled.div`
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
  description?: any[];
};

/**
 * A card section displaying different types of Cards in a gird.
 *
 *
 * <div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/f8b2da748cc44a9e8ae95a6fd51dd892" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
 *
 * This is a special kind of slice. To use follow below instructions:
 *
 * You have to first insert a 'Card Section Start' slice with the following fields:
 *
 * ### Non-repeatable zone
 * - Card Section Title
 * - Card Section Type
 * - Card Type
 * - Description
 *  - Rich Text field
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
  description,
}) => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    setIsMobile(width <= 760);
  }, [width, setIsMobile]);

  let finalCardType = cardType;

  // Display desktop card if only 1 slice is available
  if (slices.length === 1) finalCardType = 'desktop';

  // Display column card if only 2 slices are available and cardType is mobile
  if (cardType === 'mobile' && slices.length === 2) finalCardType = 'column';

  // Display a grid style if card type is mobile and no. of card are <= 4
  if (finalCardType === 'mobile' && !isMobile) {
    if (slices.length <= 4) {
      sectionType = 'Grid';
    }
  }

  let cards = slices.map((slice, index) => {
    return sliceHandler(slice, { cardType: finalCardType, index });
  });

  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
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
  }, [isMobile, swiper, updateIndex]);

  // Carousel (and Overflow Scroll for mobile) Logic
  if (sectionType === 'Carousel' && !isMobile) {
    let slidesPerView = 1;
    switch (cardType) {
      case 'column':
        slidesPerView = 2;
        break;
      case 'mobile':
        slidesPerView = 4;
        break;
      default:
        break;
    }

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
      slidesPerView,
      wrapperClass: 'cards-section-wrapper',
      spaceBetween: 20,
      getSwiper: updateSwiper,
    };

    return (
      <>
        <TitleTextCombo>
          {title ? <h2>{title}</h2> : null}
          {description ? <RichContent render={description} /> : null}
        </TitleTextCombo>
        <CardCarousel>
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
          </StyledSwiper>
          <Controls>
            {!swiper?.isBeginning ? (
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={goPrev}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            ) : null}
            {!swiper?.isEnd ? (
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {CHEVRON_LEFT_CIRCLE}
              </div>
            ) : null}
          </Controls>
        </CardCarousel>
      </>
    );
  }

  if (sectionType === 'Carousel' && isMobile) {
    return (
      <>
        <TitleTextCombo>
          {title ? <h2>{title}</h2> : null}
          {description ? <RichContent render={description} /> : null}
        </TitleTextCombo>
        <OverflowScroll>{cards}</OverflowScroll>
      </>
    );
  }

  return (
    <>
      <TitleTextCombo>
        {title ? <h2>{title}</h2> : null}
        {description ? <RichContent render={description} /> : null}
      </TitleTextCombo>
      <CardGrid
        noOfCards={cards.length}
        cardType={finalCardType}
        sectionType={sectionType}
        isMobile={isMobile}
      >
        {cards}
      </CardGrid>
    </>
  );
};

export default CardSection;
