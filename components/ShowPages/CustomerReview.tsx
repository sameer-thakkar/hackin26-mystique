import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import type { SwiperProps } from 'swiper/react';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import BlueQuotes from 'assets/blueQuotes';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const CardCarouselContainer = styled.div`
  max-width: 1200px;
  margin: auto;

  .swiper-pagination {
    z-index: 2;
  }

  .swiper-button-next {
    right: 5px;
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
    left: 5px;
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
    margin: 30px auto 0px;
    position: relative;
    .swiper-slide {
      border: 1px solid #e2e2e2;
      border-radius: 8px;
      margin-bottom: 60px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .content-wrapper-review {
        padding: 32px;
        .quote-wrapper {
          svg {
            width: 41.41px;
            height: 36.31px;
          }
        }
      }

      .quote-wrapper {
        position: absolute;
        z-index: -2;
      }

      .review-content {
        padding: 28px 32px 24px;

        .review {
          color: ${COLORS.GRAY.G2};
          font-size: 15px;
          font-weight: 400;
          line-height: 24px;
        }

        .reviewer-name {
          color: ${COLORS.GRAY.G2};
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
    background: ${COLORS.GRAY.G3} !important;
    opacity: 1 !important;
  }
  .carousel-slider .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 100%;
    background: ${COLORS.GRAY.G2};
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
        margin-bottom: 50px;

        .content-wrapper-review {
          padding: 16px;
          .quote-wrapper {
            svg {
              width: 44.96px;
              height: 36px;
            }
          }
        }
        .review-content {
          padding: 20px 16px 16px;
          .review {
            font-size: 14px;
            line-height: 20px;
            font-weight: normal;
          }

          .reviewer-name {
            font-size: 14px;
            line-height: 15px;
            margin-top: 24px;
          }
        }
      }
    }
  }
`;

type OwnCardCarouselProps = {
  cards: any[];
  isMobile: boolean;
};

type CardCarouselProps = OwnCardCarouselProps &
  typeof CustomerReview.defaultProps;

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

  onNavigationNextClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CUSTOMER_REVIEWS_SCROLLED,
      [ANALYTICS_PROPERTIES.DIRECTION]: 'Next',
    });
  };

  onNavigationPreviousClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CUSTOMER_REVIEWS_SCROLLED,
      [ANALYTICS_PROPERTIES.DIRECTION]: 'Previous',
    });
  };

  renderCardsSlider = () => {
    const { cards, isMobile } = this.props;

    const slidesPerView = isMobile ? 1 : 2;
    const slidesPerGroup = 1;
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
      pagination: {
        type: 'bullets',
        clickable: true,
      },
    };

    return (
      <Swiper
        {...params}
        onNavigationNext={this.onNavigationNextClick}
        onNavigationPrev={this.onNavigationPreviousClick}
      >
        {cards.map((element, index) => {
          return (
            <div key={index}>
              <div className="content-wrapper-review">
                <div className="quote-wrapper">{BlueQuotes}</div>
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
