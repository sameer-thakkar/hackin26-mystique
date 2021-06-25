import React, { Component } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import { BLUE_QUOTES } from '../../assets/SvgIcons';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const CardCarouselContainer = styled.div`
  max-width: 1200px;
  margin: auto;

  .swiper-pagination {
    z-index: 2;
  }

  .swiper-button-next {
    right: 0px;
    color: black;
    background: #ffffff;
    box-shadow: 0px 0px 1px rgb(0 0 0 / 10%), 0px 2px 8px rgb(0 0 0 / 10%);
    border-radius: 50%;
    width: 36px;
    z-index: 2;
    height: 36px;
    :after {
      font-size: 12px;
    }
  }

  .swiper-button-prev {
    left: 0px;
    color: black;
    background: #ffffff;
    box-shadow: 0px 0px 1px rgb(0 0 0 / 10%), 0px 2px 8px rgb(0 0 0 / 10%);
    border-radius: 50%;
    z-index: 2;
    width: 36px;
    height: 36px;
    :after {
      font-size: 12px;
    }
  }
  .carousel-slider {
    margin: 30px auto 100px;
    position: relative;
    .swiper-slide {
      border: 1px solid #e2e2e2;
      border-radius: 8px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .content-wrapper-review {
        padding: 20px;
      }

      .quote-wrapper {
        position: absolute;
        z-index: -2;
      }

      .review-content {
        padding: 20px;

        .review {
          color: #666666;
          font-size: 15px;
          font-weight: 400;
          line-height: 24px;
        }

        .reviewer-name {
          color: #444444;
          font-size: 15px;
          margin-top: 32px;
          line-height: 20px;
          font-weight: bold;
        }
      }
    }
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

    .carousel-slider {
      margin: 24px auto 70px;

      .swiper-slide {
        .review-content {
          .review {
            font-size: 14px;
            line-height: 20px;
          }

          .reviewer-name {
            font-size: 14px;
            margin-top: 24px;
          }
        }
      }
    }
  }
`;

type CardCarouselProps = {
  cards: any[];
  isMobile: boolean;
};

export default class CustomerReview extends Component<CardCarouselProps> {
  state = {
    isMobile: null,
    cardPrices: {},
    currencySymbol: '',
    isFetched: false,
  };

  static defaultProps = {
    cards: [],
    isMobile: false,
  };

  renderCardsSlider = () => {
    const { cards, isMobile } = this.props;

    const slidesPerView = isMobile ? 1 : 2;
    const slidesPerGroup = 1;
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
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    };

    return (
      <Swiper {...params}>
        {cards.map((element, index) => {
          return (
            <div key={index} className="swiper-slide">
              <div className="content-wrapper-review">
                <div className="quote-wrapper">{BLUE_QUOTES}</div>
                <div className="review-content">
                  <div className="review">{element.content}</div>
                  <div className="reviewer-name">{element.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </Swiper>
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
