import React, { Component } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';

import CategoryCard from './CategoryCard';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const CardCarouselContainer = styled.div`
  max-width: 1200px;
  margin: auto;

  .swiper-pagination {
    z-index: 2;
  }

  .swiper-button-next {
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

interface PagesDocuments {
  uid: string;
  data: {
    tgid: string;
  };
}

type CardCarouselProps = {
  cards: any[];
  isMobile: boolean;
  currencySymbol: any;
  allShowPagesDocuments: PagesDocuments[];
  currentLanguage: string;
  categoryName: string;
};

export default class CategorySlider extends Component<CardCarouselProps> {
  state = {
    isMobile: null,
    cardPrices: {},
    currencySymbol: '',
    isFetched: false,
    numberOfCard: 6,
  };

  static defaultProps = {
    cards: [],
    isMobile: false,
  };

  renderCardsSlider = () => {
    const {
      cards,
      isMobile,
      currencySymbol,
      allShowPagesDocuments,
      currentLanguage,
      categoryName,
    } = this.props;

    const slidesPerView = isMobile ? 1 : 4;
    const slidesPerGroup = isMobile ? 1 : 2;
    let params = {
      direction: 'horizontal',
      speed: 650,
      slidesPerView: slidesPerView,
      shouldSwiperUpdate: true,
      lazy: true,
      initialSlide: 1,
      spaceBetween: 24,
      slidesPerGroup: slidesPerGroup,
      centeredSlides: isMobile,
      navigation: isMobile
        ? false
        : {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
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
                      currencySymbol={currencySymbol}
                      categoryName={categoryName}
                      isMobile={isMobile}
                    ></CategoryCard>
                  </div>
                ) : null;
              })}
            </div>
            <Conditional if={this.state.numberOfCard < cards.length}>
              <button
                className="see-more"
                onClick={() => this.setState({ numberOfCard: cards.length })}
              >
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
                    currencySymbol={currencySymbol}
                    categoryName={categoryName}
                    isMobile={isMobile}
                  ></CategoryCard>
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
