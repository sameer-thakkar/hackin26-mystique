import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAmp } from 'next/amp';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import RichContent from 'UI/RichContent';
import TitleTextCombo from 'UI/TitleTextCombo';
import { CHEVRON_LEFT, CHEVRON_LEFT_CIRCLE } from 'assets/SvgIcons';
import { SIZES } from 'const/ui-constants';
import COLORS from 'const/colors';
import sliceHandler from 'components/Slices';
import Conditional from 'components/common/Conditional';
import AMPCarousel from 'components/common/AMPCarousel';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const CardGrid = styled.div(({ cardsInARow }) => {
  let gridTemplateColumns = `100%`;
  gridTemplateColumns = `repeat(${cardsInARow}, 1fr)`;
  return `
    display: grid;
    background: ${COLORS.BRAND.WHITE};
    grid-template-columns: ${gridTemplateColumns};
    grid-gap: 20px;
    @media(max-width: 768px){
      grid-template-columns: auto;
    }
`;
});

const CardCarousel = styled.div`
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
  }
  .amp-carousel > div {
    height: 400px;
  }
  .amp-carousel-button-prev,
  .amp-carousel-button-next {
    width: 24.5px;
    height: 24.5px;
    border-radius: 50%;
    background: white;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 6px 12px;
  }
  .amp-carousel-button-prev {
    left: 3px;
    background-image: url("data:image/svg+xml,%3Csvg width='8' height='16' viewBox='0 0 8 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.33325 1.33341L0.666586 8.00008L7.33325 14.6667' stroke='%23444444' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
  }
  .amp-carousel-button-next {
    right: 3px;
    background-image: url("data:image/svg+xml,%3Csvg width='8' height='16' viewBox='0 0 8 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.666748 14.6667L7.33341 8.00004L0.666748 1.33337' stroke='%23444444' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
  }
`;

const StyledSwiper = styled.div`
  overflow: hidden;
  display: flex;
  position: relative;
  max-width: ${SIZES.MAX_WIDTH};
  .cards-section-wrapper {
    display: grid;
    grid-auto-flow: column;
    padding: ${(isGlobalMb) => (isGlobalMb ? '12px 0 24px 0' : '25px 0')};

    ${({ hasLessCards }) =>
      hasLessCards &&
      `
    display:flex;
    grid-auto-flow: unset;
    `}
  }
  @media (max-width: 768px) {
    max-width: calc(100vw - 32px);
  }
`;

const Controls = styled.div`
  .prev-slide,
  .next-slide {
    position: absolute;
    top: ${({ isGlobalMb }) => (isGlobalMb ? 'calc(100% - 20px)' : '125px')};
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
    @media (max-width: 768px) {
      left: -10px;
      svg {
        height: 40px;
        width: 32px;
      }
    }
  }
  .next-slide {
    left: unset;
    right: -20px;
    svg {
      transform: rotate(180deg);
    }
    @media (max-width: 768px) {
      right: -10px;
    }
  }
`;

const ExitDescription = styled.div`
  margin-top: 32px;
  ${({ isGlobalMb, cardsInARow }) =>
    isGlobalMb &&
    cardsInARow === 1 &&
    `border-bottom: 1px solid ${COLORS.GRAY.G6};`};
`;

type CardSectionProps = {
  slices: any[];
  sectionType: string;
  cardsInARow: number;
  title?: string;
  description?: any[];
  exitDescription?: any[];
  isGlobalMb?: boolean;
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
 *
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
  isGlobalMb = false,
}) => {
  const hasLessCards = slices?.length < cardsInARow;
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = React.useState(false);
  const isAmp = useAmp();

  // Title and Text combo for the starting of the Card Section
  const EntrySection = (
    <TitleTextCombo>
      {title ? <h2>{title}</h2> : null}
      {description ? <RichContent render={description} /> : null}
    </TitleTextCombo>
  );

  // Rich Text for ending of the Card Section
  const ExitSection = exitDescription ? (
    <ExitDescription isGlobalMb={isGlobalMb} cardsInARow={cardsInARow}>
      <RichContent render={exitDescription} />
    </ExitDescription>
  ) : null;

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
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
    return sliceHandler(slice, {
      cardType: finalCardType,
      index,
      cardsInARow: cardsInARow,
      isGlobalMb,
    });
  });

  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const updateIndex = useCallback(() => updateCurrentIndex(swiper.realIndex), [
    swiper,
  ]);

  useEffect(() => {
    if (swiper !== null) {
      swiper.on('slideChange', updateIndex);
    }

    return () => {
      if (swiper !== null) {
        swiper.off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex]);

  if (sectionType === 'Carousel' && isAmp) {
    return (
      <>
        {EntrySection}
        <CardCarousel>
          <AMPCarousel type="slides" height="350" layout="fixed-height">
            {cards}
          </AMPCarousel>
        </CardCarousel>
        {ExitSection}
      </>
    );
  }

  // Carousel (and Overflow Scroll for mobile) Logic
  if (sectionType === 'Carousel' && !isAmp) {
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
      slidesPerView: isMobile ? 1 : cardsInARow,
      wrapperClass: 'cards-section-wrapper',
      spaceBetween: isGlobalMb ? 24 : 20,
      shouldSwiperUpdate: true,
      getSwiper: updateSwiper,
    };

    return (
      <>
        {EntrySection}
        <CardCarousel>
          <StyledSwiper hasLessCards={hasLessCards}>
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
            <Conditional if={!swiper?.isBeginning}>
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={goPrev}
              >
                {isAmp ? CHEVRON_LEFT : CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
            <Conditional if={!swiper?.isEnd}>
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {isAmp ? CHEVRON_LEFT : CHEVRON_LEFT_CIRCLE}
              </div>
            </Conditional>
          </Controls>
        </CardCarousel>
        {ExitSection}
      </>
    );
  }

  return (
    <>
      {EntrySection}
      <CardGrid cardsInARow={cardsInARow}>{cards}</CardGrid>
      {ExitSection}
    </>
  );
};

export default CardSection;
