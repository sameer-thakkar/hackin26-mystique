import { RichText } from 'prismic-reactjs';
import React, { Component } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

import { LinkCards } from './MicrobrandCards';
import { tourListApiParser } from '../../utils/dataParsers';

const Swiper = dynamic(() => import('components/Swiper'), { ssr: false });

const CardCarouselContainer = styled.div`
  max-width: 1200px;
  margin: auto;

  .swiper-button-next {
    right: 0;
    color: black;
    :after {
      font-size: 24px;
    }
  }
  .swiper-button-prev {
    left: 0;
    color: black;
    font-size: 24px;
    :after {
      font-size: 24px;
    }
  }
  .carousel-slider {
    margin: 50px auto;
    margin-top: 30px;
    position: relative;
    .swiper-slide {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .carousel-slider .swiper-container {
    padding: 10px 6px;
    overflow: hidden;
  }
  .carousel-slider .swiper-pagination-bullet-active {
    background: #ec1943 !important;
    opacity: 1 !important;
  }
  .carousel-slider .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 100%;
    background: #000;
    opacity: 0.2;
  }
  .carousel-slider .swiper-container {
    margin: 0 35px;
    width: auto;
    position: static;
  }
  .carousel-slider .swiper-pagination.swiper-pagination-bullets {
    top: -30px;
    right: 41px;
    bottom: unset;
    left: unset;
    width: unset;
    grid-gap: unset;
  }
  .carousel-slider .swiper-button-next.swiper-button-disabled {
    opacity: 0;
  }
  @media (max-width: 768px) {
    max-width: 100vw;
    .carousel-slider .swiper-pagination.swiper-pagination-bullets {
      top: -15px;
    }
    .carousel-slider .swiper-container {
      margin: 0;
    }
    .carousel-slider .swiper-pagination.swiper-pagination-bullets {
      right: 12px;
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

type CardCarouselProps = {
  cards: any[];
  carouselHeading: string;
};

/**
 * A simple carousel of cards displaying different products with prices (using TGIDs)
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - Carousel Heading
 *  - Rich Text field
 *
 * ### Repeatable zone
 * - Image Source
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Image Url
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 * - *TGID
 *  - Tour group id of the card
 * - *Card Title
 * - Card Link
 *  - Link which will open on clicking the card
 */

export default class CardCarousel extends Component<CardCarouselProps> {
  state = {
    isMobile: null,
    isClient: false,
    cardPrices: {},
    currencySymbol: '',
    isFetched: false,
  };

  static defaultProps = {
    cards: [],
    carouselHeading: '',
  };

  async componentDidMount() {
    const mobileCheck = window.innerWidth < 768;
    const { cards } = this.props;
    const tgids = cards.map((card) => card.tgid);
    const fetchPrice = await fetch(
      `/api/tours/v5/tour-group/list?ids[]=${tgids}`
    ).then((res) => res.json());
    const cardPrices = tourListApiParser(fetchPrice);
    const currencySymbol = fetchPrice.currencies[0]?.localSymbol;
    this.setState({
      cardPrices: cardPrices,
      currencySymbol: currencySymbol,
      isFetched: true,
      isMobile: mobileCheck,
      isClient: true,
    });
  }

  renderCardsSlider = () => {
    const { cards } = this.props;
    const finalCards = cards.map((card) => {
      return {
        image: {
          url: card.image_url?.url || card.image_source?.url,
          alt: card.image_alt || card.image_source?.alt,
        },
        title: card.card_title,
        tgid: card.tgid,
        link: card.card_link?.url,
      };
    });
    const { isMobile, isFetched, cardPrices, currencySymbol } = this.state;
    const slidesPerView = isMobile ? 1.1 : 4;
    const slidesPerGroup = isMobile ? 1 : 4;
    let params = {
      direction: 'horizontal',
      speed: 650,
      slidesPerView: slidesPerView,
      shouldSwiperUpdate: true,
      lazy: true,
      initialSlide: 1,
      spaceBetween: 8,
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
        <LinkCards
          as={React.Fragment}
          isFetched={isFetched}
          cards={finalCards}
          cardPrices={cardPrices}
          cardClassName={'swiper-slide'}
          currencySymbol={currencySymbol}
          gridAutoCol={true}
        />
      </Swiper>
    );
  };

  render() {
    const { carouselHeading } = this.props;
    const { isClient } = this.state;
    return (
      <CardCarouselContainer>
        <div className="card-carousel-heading">
          <RichText render={carouselHeading} />
        </div>
        <div className="carousel-slider">
          {isClient ? this.renderCardsSlider() : ''}
        </div>
      </CardCarouselContainer>
    );
  }
}
