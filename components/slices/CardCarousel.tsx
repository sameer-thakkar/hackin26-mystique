import React, { Component } from 'react';
import { RichText } from 'prismic-reactjs';
import Image from '../UI/Image';
import Swiper from '../Swiper';
import { tourListApiParser } from '../../utils/DataParsers';

type CardCarouselProps = {
  cards: any[];
  carouselHeading: string;
  lazyLoadImages?: boolean;
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
    lazyLoadImages: true,
  };

  async componentDidMount() {
    const mobileCheck = window.innerWidth < 768;
    const { cards } = this.props;
    const tgids = cards.map(card => card.tgid);
    const fetchPrice = await fetch(
      `https://api.headout.com/api/v5/tour-group/list?ids[]=${tgids}`
    ).then(res => res.json());
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
    const { isFetched, currencySymbol, cardPrices, isMobile } = this.state;
    const slidesPerView = isMobile ? 1 : 4;
    const slidesPerGroup = isMobile ? 1 : 4;
    const params = {
      direction: 'horizontal',
      speed: 650,
      slidesPerView: slidesPerView,
      rebuildOnUpdate: true,
      lazy: true,
      initialSlide: 1,
      spaceBetween: 8,
      slidesPerGroup: slidesPerGroup,
      centeredSlides: isMobile,
      navigation: {
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
        {cards.map((card, index) => {
          return (
            <div key={index} className="swiper-slide">
              <a
                target={card.card_link?.target ?? '_blank'}
                href={card.card_link?.url}
              >
                <div className="microbrand-card">
                  <div className="card-image">
                    <Image
                      dontLazyLoad={!this.props.lazyLoadImages}
                      format="pjpg"
                      width={600}
                      height={300}
                      url={card.image_url?.url || card.image_source?.url}
                      alt={card.image_alt || card.image_source?.alt}
                    />
                  </div>
                  <div className="card-bottom">
                    <span className="card-title">{card.card_title}</span>
                    <span className="card-price">
                      {currencySymbol}
                      {isFetched ? cardPrices[card.tgid].price : ''}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </Swiper>
    );
  };

  render() {
    const { carouselHeading } = this.props;
    const { isClient } = this.state;
    return (
      <div className="card-carousel-container">
        <div className="card-carousel-heading">
          <RichText render={carouselHeading} />
        </div>
        <div className="carousel-slider">
          {isClient ? this.renderCardsSlider() : ''}
        </div>
      </div>
    );
  }
}
