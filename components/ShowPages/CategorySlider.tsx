import React, { Component } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { convertUidToUrl } from 'utils/urlUtils';
import PriceBlock, { SavedTag } from 'UI/PriceBlock';

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
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }

      .tour-scratch-price {
        color: #888888;
        font-size: 12px;
      }

      .tour-price {
        color: #444444;
        font-weight: 600;
        font-size: 16px;
      }

      ${SavedTag}{
        color: #088943;
        background: #dbfddb;
        padding: 2px 6px;
        border-radius: 2px;
        font-size: 11px;
      }

      p {
        margin: 0;
      }

      h3 {
        margin: 8px 0 12px;
        font-size: 16px;
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
};

export default class CategorySlider extends Component<CardCarouselProps> {
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
    const {
      cards,
      isMobile,
      currencySymbol,
      allShowPagesDocuments,
      currentLanguage,
    } = this.props;

    const slidesPerView = isMobile ? 1.05 : 4.05;
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
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    };

    return (
      <Swiper {...params}>
        {cards.map((element, index) => {
          const { listingPrice, name, imageUrl, id, tourGroupUrl } = element;

          const {
            currencyCode,
          } = listingPrice;

          let cardDocument = allShowPagesDocuments.filter(
            (element) => element.data.tgid === id
          );
          const redirectURL = cardDocument.length
            ? convertUidToUrl(cardDocument[0].uid)
            : `https://www.headout.com${tourGroupUrl}`;

          return (
            <div key={index} className="swiper-slide">
              <a href={redirectURL} target="blank">
                <img src={imageUrl} alt={name} />
                <h3>{name}</h3>
                <div>
                  <PriceBlock
                    price={listingPrice}
                    lang={currentLanguage}
                    showSavings={true}
                    showScratchPrice={true}
                    currencySymbolOverride={currencySymbol[currencyCode]}
                    prefix={true}
                  />
                </div>
              </a>
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
