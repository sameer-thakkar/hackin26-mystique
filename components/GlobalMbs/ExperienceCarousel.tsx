import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { COLORS, SIZES, SOLEIL } from 'const/ui-constants';
import { CHEVRON_LEFT, CHEVRON_LEFT_CIRCLE } from 'assets/SvgIcons';
import Image from 'UI/Image';
import OverflowScroll from 'UI/OverflowScroll';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import Conditional from 'components/common/Conditional';
const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const Carousel = styled.div`
  position: relative;
`;

const StyledSwiper = styled.div`
  overflow: hidden;
  display: flex;
  position: relative;
  max-width: ${SIZES.MAX_WIDTH};
  .cards-section-wrapper {
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
    top: 50%;
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

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  font-family: ${SOLEIL.FONT_STACK};
  @media (max-width: 500px) {
    margin-bottom: 24px;
  }
  h2 {
    font-size: 24px;
    font-weight: ${SOLEIL.SEMIBOLD};
    line-height: 28px;
    color: ${COLORS.GREY.G2};
    margin: 0;
  }
  a {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: ${COLORS.GREY.G2};
  }
  svg {
    height: 10px;
    transform: rotate(180deg);
  }
`;

const StyledCard = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  .title {
    font-size: 16px;
    font-weight: ${SOLEIL.SEMIBOLD};
    line-height: 20px;
    margin-bottom: 8px;
  }
  .tag-wrapper {
    display: flex;
  }
  .tag {
    font-size: 12px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    line-height: 12px;
    margin-right: 8px;
    padding: 4px 8px;
    color: ${COLORS.GREY.G3};
    background-color: ${COLORS.GREY.G7};
    border-radius: 2px;
    &:last-child {
      margin-right: 0;
    }
  }
  .ticket-wrapper {
    display: grid;
    grid-template-rows: repeat(2, max-content);
    row-gap: 4px;
  }
  .from-price {
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    font-size: 12px;
    line-height: 16px;
    color: ${COLORS.GREY.G4};
  }
  .from-price span {
    color: ${COLORS.GREY.G4};
    text-decoration: line-through;
  }
  .final-price {
    font-size: 16px;
    line-height: 16px;
    font-style: normal;
    font-weight: ${SOLEIL.SEMIBOLD};
    color: ${COLORS.GREY.G3};
  }
  .final-price .discount {
    color: ${COLORS.OKAY_GREEN};
    background-color: ${COLORS.LIGHTER_GREEN};
    border-radius: 2px;
    font-size: 11px;
    line-height: 12px;
    font-style: normal;
    font-weight: ${SOLEIL.REGULAR};
    letter-spacing: 0.2px;
    padding: 2px 4px;
    margin-left: 8px;
  }
`;

type ExperienceProps = {
  cardsInARow: number;
  experienceType: string;
  mbType?: string;
  showSeeAll: boolean;
  title: string;
  experiencePageUid?: string;
  attractions?: any[];
  rides?: any[];
  tickets?: any;
};

const ExperienceCarousel: FunctionComponent<ExperienceProps> = ({
  cardsInARow = 4,
  experienceType,
  showSeeAll = true,
  title,
  experiencePageUid,
  attractions,
  rides,
  tickets,
}) => {
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = useState(false);
  const [swiper, updateSwiper] = useState(null);
  const [_currentIndex, updateCurrentIndex] = useState(0);
  const updateIndex = useCallback(() => updateCurrentIndex(swiper.realIndex), [
    swiper,
  ]);

  const currencySymbol = tickets?.currencySymbol?.localSymbol;

  // isMobile effect
  useEffect(() => {
    setIsMobile(width <= 768);
  }, [width, setIsMobile]);

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

  let cards;

  switch (experienceType) {
    case 'Attractions':
      cards = attractions?.map((a) => a);
      break;
    case 'Rides':
      cards = rides?.map((a) => a);
      break;
    case 'Tickets':
      cards = [...tickets?.data?.products];
  }

  const entrySection = (
    <HeadingWrapper>
      <h2>{title}</h2>
      {showSeeAll && (
        <a href={convertUidToUrl(experiencePageUid)}>See All {CHEVRON_LEFT}</a>
      )}
    </HeadingWrapper>
  );

  let ridesAttractionMarkup, ticketsMarkup;

  if (experienceType === 'Attractions' || experienceType === 'Rides') {
    ridesAttractionMarkup = cards?.map((card, index) => {
      const ageGroupTag = card?.age_group ? card?.age_group?.split(',') : null;
      const experienceTag = card?.experience_tags
        ? card?.experience_tags?.split(',')
        : null;
      return (
        <div key={index} className="swiper-slide">
          <StyledCard key={index}>
            <Image
              url={card?.experience_image?.url}
              className="image"
              alt={card?.image_alt_text}
            />
            <div className="title">{card?.name}</div>
            <div className="tag-wrapper">
              {experienceTag?.length &&
                experienceTag?.map((tag, index) => (
                  <div key={`exp-${index}`} className="tag">
                    {tag}
                  </div>
                ))}
              {ageGroupTag?.length &&
                ageGroupTag?.map((tag, index) => (
                  <div key={`age-${index}`} className="tag">
                    {tag}
                  </div>
                ))}
            </div>
          </StyledCard>
        </div>
      );
    });
  }
  if (experienceType === 'Tickets') {
    ticketsMarkup = cards?.map((card, index) => (
      <div key={index} className="swiper-slide">
        <StyledCard>
          <Image
            url={getValidUrl(card?.imageUrl)}
            className="image"
            alt={card?.image_alt_text}
          />
          <div className="title">{card?.name}</div>
          {card?.listingPrice && (
            <div className="price-wrapper">
              {card?.listingPrice?.originalPrice >
                card?.listingPrice?.finalPrice && (
                <div className="from-price">
                  from{' '}
                  <span>
                    {currencySymbol}
                    {card?.listingPrice?.originalPrice}
                  </span>
                </div>
              )}

              <div className="final-price">
                {currencySymbol} {card?.listingPrice?.finalPrice}
                {card?.listingPrice?.bestDiscount > 0 && (
                  <span className="discount">
                    {card?.listingPrice?.bestDiscount}
                    {card?.listingPrice?.cashbackType === 'PERCENTAGE' && '%'}
                  </span>
                )}
              </div>
            </div>
          )}
        </StyledCard>
      </div>
    ));
  }

  if (!isMobile) {
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
      spaceBetween: 24,
      shouldSwiperUpdate: true,
      getSwiper: updateSwiper,
    };

    return (
      <>
        <Conditional
          if={attractions?.length || rides?.length || tickets?.length}
        >
          {entrySection}
          <Carousel>
            <StyledSwiper>
              <Swiper {...swiperParams}>
                <Conditional if={ridesAttractionMarkup}>
                  {ridesAttractionMarkup}
                </Conditional>
                <Conditional if={ticketsMarkup}>{ticketsMarkup}</Conditional>
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
          </Carousel>
        </Conditional>
      </>
    );
  }

  if (isMobile) {
    return (
      <>
        <Conditional
          if={attractions?.length || rides?.length || tickets?.length}
        >
          {entrySection}
          <OverflowScroll minWidthChild="calc(100vw - 93px)" marginBottom={0}>
            {ridesAttractionMarkup || ticketsMarkup}
          </OverflowScroll>
        </Conditional>
      </>
    );
  }
};

export default ExperienceCarousel;
