import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import { TAddVenueSeatsPageSectionViewedDataEvents } from 'components/SeatMapPage/interface';
import sliceHandler from 'components/Slices';
import RichContent from 'UI/RichContent';
import TitleTextCombo from 'UI/TitleTextCombo';
import useOnScreen from 'hooks/useOnScreen';
import { generateSidenavId } from 'utils/helper';
import COLORS from 'const/colors';
import { SLICE_TYPES } from 'const/index';
import { SIZES } from 'const/ui-constants';
import ChevronLeftCircle from 'assets/chevronLeftCircle';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: true });

/**
 * NOTE: ".rich-text p" margin-bottom has been removed as rich-text slice within
 *   card-grid is used when google map embeddings are added. This CSS removes
 *   the bottom margin that creates an empty space.
 */
// @ts-expect-error TS(2339): Property 'cardsInARow' does not exist on type 'Pic... Remove this comment to see the full error message
const CardGrid = styled.div(({ cardsInARow }) => {
  let gridTemplateColumns = `100%`;
  gridTemplateColumns = `repeat(${cardsInARow}, 1fr)`;

  /**
   * NOTE: ".rich-text p" margin-bottom has been removed as rich-text slice within
   *   card-grid is used when google map embeddings are added. This CSS removes
   *   the bottom margin that creates an empty space.
   */
  return `
    display: grid;
    background: ${COLORS.BRAND.WHITE};
    grid-template-columns: ${gridTemplateColumns};
    grid-gap: 20px;

    .rich-text p {
      margin-bottom: 0;
    }
    
    @media(max-width: 768px){
      grid-template-columns: auto;
    }
`;
});

const CardCarousel = styled.div`
  position: relative;
  &:not(.swiper-initialized) .swiper-wrapper {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledSwiper = styled.div`
  position: relative;
  max-width: ${SIZES.MAX_WIDTH};

  .cards-section-wrapper,
  .swiper-wrapper {
    padding: ${(isGlobalMb) => (isGlobalMb ? '12px 0 24px 0' : '25px 0')};

    ${({
      // @ts-expect-error TS(2339): Property 'hasLessCards' does not exist on type 'Pi... Remove this comment to see the full error message
      hasLessCards,
    }) =>
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
    top: ${({
      // @ts-expect-error TS(2339): Property 'isGlobalMb' does not exist on type 'Pick... Remove this comment to see the full error message
      isGlobalMb,
    }) => (isGlobalMb ? 'calc(100% - 20px)' : '125px')};
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

const ExitDescription = styled.div<{ isGlobalMb: any; cardsInARow: any }>`
  margin-top: 32px;
  display: flex;

  ${({
    isGlobalMb,
    cardsInARow,
  }: {
    isGlobalMb: boolean;
    cardsInARow: number;
  }) =>
    isGlobalMb &&
    cardsInARow === 1 &&
    `border-bottom: 1px solid ${COLORS.GRAY.G6};`};
`;

type CardSectionProps = {
  childSlices: any[];
  sectionType: string;
  cardsInARow: number;
  title?: string;
  description?: any[];
  exitDescription?: any[];
  isGlobalMb?: boolean;
  sectionName?: string;
  showSeatMapExperiment?: boolean;
  index?: number;
  addVenueSeatsPageSectionViewedDataEvents?: TAddVenueSeatsPageSectionViewedDataEvents;
  isSeatMapExpControlAndEligible?: boolean;
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

const CardSection: React.FC<React.PropsWithChildren<CardSectionProps>> = ({
  childSlices: slices,
  cardsInARow,
  sectionType,
  title,
  description,
  exitDescription,
  isGlobalMb = false,
  sectionName,
  showSeatMapExperiment,
  index,
  addVenueSeatsPageSectionViewedDataEvents,
  isSeatMapExpControlAndEligible,
}) => {
  const hasLessCards = slices?.length < cardsInARow;
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = React.useState(false);
  const cardSectionRef = useRef(null);
  const isIntersecting = useOnScreen({
    ref: cardSectionRef,
    unobserve: true,
  });

  // Title and Text combo for the starting of the Card Section
  const EntrySection = (
    <Conditional if={title?.length || description?.length}>
      <TitleTextCombo ref={cardSectionRef}>
        {title && <h2 id={generateSidenavId(title)}>{title}</h2>}
        {description?.length ? (
          <RichContent
            render={description}
            parentProps={{
              sectionName: title,
              sliceType: SLICE_TYPES.CARD_SECTION,
            }}
          />
        ) : null}
      </TitleTextCombo>
    </Conditional>
  );

  // Rich Text for ending of the Card Section
  const ExitSection = exitDescription?.length ? (
    <ExitDescription isGlobalMb={isGlobalMb} cardsInARow={cardsInARow}>
      <RichContent
        render={exitDescription}
        parentProps={{
          sectionName: title,
          sliceType: SLICE_TYPES.CARD_SECTION,
        }}
      />
    </ExitDescription>
  ) : null;

  useEffect(() => {
    if (isSeatMapExpControlAndEligible && index === 2 && isIntersecting) {
      addVenueSeatsPageSectionViewedDataEvents?.({
        sectionName: title ?? '',
        rank: index + 1,
      });
    }
    if (!showSeatMapExperiment) {
      return;
    }
    if ((index === 0 || index === 1) && isIntersecting) {
      addVenueSeatsPageSectionViewedDataEvents?.({
        sectionName: title ?? '',
        rank: 3 + index,
      });
    }
  }, [
    isIntersecting,
    index,
    showSeatMapExperiment,
    addVenueSeatsPageSectionViewedDataEvents,
    title,
  ]);

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

  let finalCardType: any;
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
      isMobile,
      sectionName: title ?? sectionName,
      isSeatMapExpControlAndEligible,
    });
  });

  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const updateIndex = useCallback(
    () => updateCurrentIndex((swiper as any)?.realIndex as number),
    [swiper]
  );

  useEffect(() => {
    if (swiper !== null) {
      (swiper as any).on('slideChange', updateIndex);
    }
    return () => {
      if (swiper !== null) {
        (swiper as any).off('slideChange', updateIndex);
      }
    };
  }, [isMobile, swiper, updateIndex]);

  // Carousel (and Overflow Scroll for mobile) Logic
  if (sectionType === 'Carousel') {
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

    const swiperParams: SwiperProps = {
      slidesPerView: isMobile ? 1 : cardsInARow,
      centeredSlides: false,
      initialSlide: 0,
      spaceBetween: isGlobalMb ? 24 : 20,
      // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
      onSwiper: updateSwiper,
      direction: 'horizontal',
    };

    return (
      <>
        {EntrySection}
        <CardCarousel>
          {/* @ts-expect-error TS(2769): No overload matches this call. */}
          <StyledSwiper hasLessCards={hasLessCards}>
            <Swiper {...swiperParams}>
              {cards.map((card, index) => {
                return <React.Fragment key={index}>{card}</React.Fragment>;
              })}
            </Swiper>
          </StyledSwiper>
          <Controls>
            <Conditional if={!(swiper as any)?.isBeginning}>
              <div
                className="prev-slide"
                role="button"
                tabIndex={0}
                onClick={goPrev}
              >
                {ChevronLeftCircle}
              </div>
            </Conditional>
            <Conditional if={!(swiper as any)?.isEnd}>
              <div
                className="next-slide"
                role="button"
                tabIndex={0}
                onClick={goNext}
              >
                {ChevronLeftCircle}
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
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <CardGrid cardsInARow={cardsInARow}>{cards}</CardGrid>
      {ExitSection}
    </>
  );
};

export default CardSection;
