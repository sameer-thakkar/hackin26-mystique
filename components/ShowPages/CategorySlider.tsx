import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { PrismicDocumentWithUID } from '@prismicio/types';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import CategoryCard from 'components/ShowPages/CategoryCard';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const CardCarouselContainer = styled.div`
  max-width: 1200px;
  margin: auto;

  .swiper-initialized {
    margin: 0px;
    width: auto;
    position: static;
  }

  .swiper-pagination {
    z-index: 2;
  }

  .swiper-button-next {
    position: absolute;
    top: 40%;
    right: -23px;
    color: black;
    z-index: 2;
    border-radius: 50%;
    width: 10px;
    height: 20px;
    :after {
      font-size: 12px;
    }
  }
  .swiper-button-prev {
    position: absolute;
    top: 40%;
    left: -23px;
    color: black;
    z-index: 2;
    border-radius: 50%;
    width: 10px;
    height: 20px;
    :after {
      font-size: 12px;
    }
  }
  .carousel-slider {
    margin: 30px auto 0px;
    position: relative;
  }
  .carousel-slider .mobile-category-wrapper {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: 50% 50%;
  }
  .carousel-slider .see-more {
    font-weight: 600;
    font-size: 16px;
    color: #444444;
    width: 100%;
    padding: 12px 24px;
    border: 1px solid #444444;
    box-sizing: border-box;
    border-radius: 4px;
    background: #ffffff;
    margin-top: 20px;
  }
  .carousel-slider .swiper-container {
    overflow: hidden;
  }
  .carousel-slider .swiper-pagination-bullet-active {
    background: #666666 !important;
    opacity: 1 !important;
  }
  .carousel-slider .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 100%;
    background: #444444;
    opacity: 0.1;
  }
  .carousel-slider .swiper-container {
    margin: 0;
    width: auto;
    position: static;
  }
  .carousel-slider .swiper-pagination.swiper-pagination-bullets {
    width: 100%;
    justify-content: center;
    bottom: -30px;
  }
  .carousel-slider .swiper-button-next.swiper-button-disabled {
    opacity: 0;
  }
  .carousel-slider .swiper-button-prev.swiper-button-disabled {
    opacity: 0;
  }
  @media (max-width: 768px) {
    max-width: 100vw;
    .carousel-slider .swiper-container {
      margin: 0;
    }
    .carousel-slider .swiper-container {
      padding: 0;
    }
    .card-carousel-heading {
      margin: 0 12px;
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 0;
        margin-bottom: 10px;
      }
    }
  }
`;

export interface PagesDocuments {
  uid: string;
  data: {
    tgid: string;
  };
}

type OwnCardCarouselProps = {
  cards: any[];
  isMobile: boolean;
  allShowPagesDocuments: PrismicDocumentWithUID[];
  currentLanguage: string;
  categoryName: string;
  isNewsPage: boolean;
};

type CardCarouselState = any;

type CardCarouselProps = OwnCardCarouselProps &
  typeof CategorySlider.defaultProps;

export default class CategorySlider extends Component<
  CardCarouselProps,
  CardCarouselState
> {
  state = {
    isMobile: null,
    cardPrices: {},
    isFetched: false,
    numberOfCard: 6,
  };

  static defaultProps = {
    cards: [],
    isMobile: false,
    isNewsPage: false,
  };

  renderCardsSlider = () => {
    const {
      cards,
      isMobile,
      allShowPagesDocuments,
      currentLanguage,
      categoryName,
      isNewsPage,
    } = this.props;

    const slidesPerView = isMobile ? 1 : 4;
    const slidesPerGroup = isMobile ? 1 : 2;
    let params: SwiperProps = {
      direction: 'horizontal',
      speed: 650,
      slidesPerView: slidesPerView,
      lazy: true,
      initialSlide: 1,
      spaceBetween: 24,
      slidesPerGroup: slidesPerGroup,
      centeredSlides: isMobile,
      navigation: !isMobile,
    };

    const handleShowMoreCTAClick = () => {
      this.setState({ numberOfCard: cards.length });
      if (isNewsPage)
        trackEvent({
          eventName: ANALYTICS_EVENTS.NEWS_PAGE.NEWS_PAGE_CTA_CLICKED,
          [ANALYTICS_PROPERTIES.SECTION]: 'Popular Shows',
          [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.SEE_MORE_SHOWS,
        });
    };

    return (
      <>
        {isMobile ? (
          <>
            <div className="mobile-category-wrapper">
              {cards.map((element, index) => {
                return index < this.state.numberOfCard ? (
                  <div key={index}>
                    <CategoryCard
                      allShowPagesDocuments={allShowPagesDocuments}
                      element={element}
                      currentLanguage={currentLanguage}
                      categoryName={categoryName}
                      isMobile={isMobile}
                    />
                  </div>
                ) : null;
              })}
            </div>
            <Conditional if={this.state.numberOfCard < cards.length}>
              <button className="see-more" onClick={handleShowMoreCTAClick}>
                See More Shows
              </button>
            </Conditional>
          </>
        ) : (
          <Swiper {...params}>
            {cards.map((element, index) => {
              return (
                <div key={index} className="swiper-slide">
                  <CategoryCard
                    allShowPagesDocuments={allShowPagesDocuments}
                    element={element}
                    currentLanguage={currentLanguage}
                    categoryName={categoryName}
                    isMobile={isMobile}
                  />
                </div>
              );
            })}
          </Swiper>
        )}
      </>
    );
  };

  render() {
    return (
      <CardCarouselContainer>
        <div className="carousel-slider">{this.renderCardsSlider()}</div>
      </CardCarouselContainer>
    );
  }
}
