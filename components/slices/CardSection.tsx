import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';
import useWindowSize from '../hooks/useWindowSize';
import Swiper from '../Swiper';
import OverflowScroll from '../UI/OverflowScroll';
import RichContent from '../UI/RichContent';
import TitleTextCombo from '../UI/TitleTextCombo';
import { CHEVRON_LEFT_CIRCLE } from '../../public/static/svg-icons';

const CardGrid = styled.div(({ cardsInARow, isMobile }) => {
  let gridTemplateColumns = `100%`;
  if (cardsInARow === 2 && !isMobile) {
    gridTemplateColumns = `50% 50%`;
  } else if (cardsInARow > 2 && !isMobile) {
    gridTemplateColumns = `repeat(${cardsInARow}, calc(${
      100 / cardsInARow
    }% - 15px))`;
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

const ExitDescription = styled.div`
  margin-top: 32px;
`;

type CardSectionProps = {
  slices: any[];
  sectionType: string;
  cardsInARow: number;
  title?: string;
  description?: any[];
  exitDescription?: any[];
};

/**
 * A card section displaying different types of Cards in a gird or carousel.
 *
 * Video Explanation:
 *
 * <div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/201e52ef4704415e9a819728ad2ad511" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
 *
 * This is a special kind of slice. To use follow below instructions:
 *
 * You have to first insert a 'Card Section Start' slice with the following fields:
 *
 * ### Non-repeatable zone
 * - Card Section Title
 * - Card Section Type
 * - No. of Cards in a Row
 *  - Min 1 (Default) and Max 4
 *  - This field will decide how the cards look
 *  - If 1 is selected a full-width card is displayed
 * - Description
 *  - Rich Text field
 * - Exit Description
 *  - Rich Text field
 * ### Repeatable zone
 * Nil.
 *
 * After this, keep adding intermediate <a href="https://headout.github.io/mystique/?path=/docs/slices-card--with-link-cta">Card slices</a> and then close the Section with a 'Card Section End' slice.
 */

const CardSection: React.FC<CardSectionProps> = ({
  slices,
  cardsInARow,
  sectionType,
  title,
  description,
  exitDescription,
}) => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = React.useState(false);

  // Title and Text combo for the starting of the Card Section
  const EntrySection = (
    <TitleTextCombo>
      {title ? <h2>{title}</h2> : null}
      {description ? <RichContent render={description} /> : null}
    </TitleTextCombo>
  );

  // Rich Text for ending of the Card Section
  const ExitSection = exitDescription ? (
    <ExitDescription>
      <RichContent render={exitDescription} />
    </ExitDescription>
  ) : null;

  useEffect(() => {
    setIsMobile(width <= 760);
  }, [width, setIsMobile]);

  let finalCardType;
  switch (cardsInARow) {
    case 1:
      finalCardType = 'full-width';
      break;
    case 2:
      finalCardType = 'large';
      break;
    default:
      finalCardType = 'small';
      break;
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
      wrapperClass: 'cards-section-wrapper',
      spaceBetween: 20,
      getSwiper: updateSwiper,
    };

    return (
      <>
        {EntrySection}
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
        {ExitSection}
      </>
    );
  }

  if (sectionType === 'Carousel' && isMobile) {
    return (
      <>
        {EntrySection}
        <OverflowScroll>{cards}</OverflowScroll>
        {ExitSection}
      </>
    );
  }

  return (
    <>
      {EntrySection}
      <CardGrid cardsInARow={cardsInARow} isMobile={isMobile}>
        {cards}
      </CardGrid>
      {ExitSection}
    </>
  );
};

export default CardSection;
