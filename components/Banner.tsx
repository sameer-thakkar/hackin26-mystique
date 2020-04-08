import React, { Component } from 'react';
import classNames from 'classnames';
import { scroller } from 'react-scroll';
import * as labels from '../public/static/localization/labels';
import Button from './UI/Button';
import Image from './UI/Image';
import styled from 'styled-components';

const StyledBanner = styled.div`
  display: grid;
  height: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.16);
  font-family: 'Graphik', 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  margin-top: 80px;
  margin-bottom: 40px;

  .mb-slide {
    display: none;
  }

  .mb-slide.active-mb-slide,
  .mb-slide.prev-slide {
    display: block;
    height: inherit;
  }
  .fade-in {
    animation: fade 0.3s ease forwards;
  }
  .fade-out {
    animation: fade 0.3s ease backwards;
  }

  .mb-slide img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: 20% 10%;
  }

  @-webkit-keyframes fade {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fade {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  .indicators {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    grid-gap: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
  }

  .indicator {
    height: 10px;
    width: 10px;
    border: 2px solid #fff;
    border-radius: 100%;
    cursor: pointer;
  }

  .indicator.active {
    background: #fff;
  }

  .mb-captions {
    z-index: 0;
    height: 100%;
    width: 100%;
    display: grid;
    place-content: center;
    text-align: center;
    background: #0000004a;
  }

  .mb-captions .caption h1 {
    font-size: 22px;
    color: #fff;
    line-height: 1.5;
  }

  .mb-captions,
  .mb-slide.active-mb-slide,
  .mb-slide.prev-slide {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .mb-captions .mb-caption {
    display: grid;
    grid-gap: 14px;
    justify-items: center;
  }

  .mb-captions .mb-cta {
    background-color: rgba(0, 0, 0, 0.35);
    border: solid white 1px;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 1.2px;
    /* -webkit-transition: all 0.5s ease;
  transition: all 0.5s ease; */
    cursor: pointer;
    padding: 15px 40px;
    justify-self: center;
    color: #fff;
    font-size: 16px;
  }
  .mb-captions .mb-cta:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .mb-caption a {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    margin-top: 60px;
    .mb-captions .mb-caption {
      justify-items: left;
      margin-bottom: 24px;
      margin-left: 16px;
      max-width: 85%;
      z-index: 1;
    }
    .mb-captions.with-indicators .mb-caption {
      margin-bottom: 56px;
    }

    .mb-captions {
      place-content: unset;
      text-align: left;
      align-items: end;
      background: unset;
    }

    .caption h1 {
      font-weight: 500;
      font-size: 20px;
      line-height: 120%;
      margin: 0;
    }

    .mb-captions::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 200px;
      width: 100%;
      background: linear-gradient(180deg, rgba(34, 34, 34, 0) 0%, #222222 100%);
      z-index: 0;
      opacity: 0.4;
    }

    .indicators {
      left: 16px;
      transform: unset;
      bottom: 24px;
    }

    .indicator {
      height: 6px;
      width: 6px;
      border: unset;
      background: rgba(255, 255, 255, 0.35);
    }

    .indicator.active {
      transform: scale(1.3);
    }
  }
`;

const BANNER_PARAMS = {
  DESKTOP: {
    ASPECT_RATIO: '4.5:1',
    WIDTH: '1200',
  },
  MOBILE: {
    ASPECT_RATIO: '1:1.07',
    WIDTH: '500',
  },
};

const StyledButton = styled.div`
  @media (max-width: 768px) {
    button {
      font-size: 14px;
      padding: 11px 25px;
      line-height: 20px;
    }
  }
`;
export default class Banner extends Component<any, any> {
  hasIndicators: boolean;
  MAX_SLIDES: number;
  SLIDE_CHANGE_INTERVAL: number;
  activeSlideIndex: number;
  prevSlideIndex: number;
  MB_CAROUSEL_INT: any;

  constructor(props) {
    super(props);
    this.hasIndicators = true;
    this.MAX_SLIDES = this.props.bannerImages.length;
    this.SLIDE_CHANGE_INTERVAL = 3500;
    this.prevSlideIndex = this.activeSlideIndex = 0;
    this.state = {
      counter: 0,
      isMobile: null,
      isClient: false,
    };
  }

  componentDidMount() {
    const mobileCheck = window.innerWidth < 768;
    this.setState({
      isMobile: mobileCheck,
      isClient: true,
    });
    if (this.props.bannerImages.length > 1) this.autoSlide();
  }

  nextSlide = () => {
    clearInterval(this.MB_CAROUSEL_INT);
    this.changeSlide(1);
    this.autoSlide();
  };
  prevSlide = () => {
    clearInterval(this.MB_CAROUSEL_INT);
    this.changeSlide(-1);
    this.autoSlide();
  };

  getBoundedIndex = (index, dir) => {
    index = index == 0 ? this.MAX_SLIDES : index;
    index = (index + 1 * dir) % this.MAX_SLIDES;
    return index;
  };

  changeSlide = (dir = 1) => {
    this.prevSlideIndex = this.activeSlideIndex;
    this.activeSlideIndex = this.getBoundedIndex(this.activeSlideIndex, dir);
    this.setState({ counter: this.state.counter + 1 });
  };

  autoSlide = () => {
    this.MB_CAROUSEL_INT = setInterval(
      this.changeSlide,
      this.SLIDE_CHANGE_INTERVAL
    );
  };

  slideTo = (index = 0) => {
    clearInterval(this.MB_CAROUSEL_INT);
    this.activeSlideIndex = this.getBoundedIndex(index, -1);
    this.changeSlide();
    this.autoSlide();
  };

  renderBanners = (image) => {
    const { url, alt } = image;
    const { isMobile } = this.state;
    const { ASPECT_RATIO, WIDTH } = isMobile
      ? BANNER_PARAMS.MOBILE
      : BANNER_PARAMS.DESKTOP;

    return (
      <Image
        width={WIDTH}
        aspectRatio={ASPECT_RATIO}
        url={url}
        alt={alt || 'banner'}
      />
    );
  };

  scrollTicketSection = () => {
    scroller.scrollTo('tour-list-heading', {
      duration: 1200,
      offset: this.state.isMobile ? -80 : -100,
      smooth: 'easeInOutQuart',
    });
  };

  render() {
    const { bannerHeading, bannerImages, currentLanguage } = this.props;
    const { isClient } = this.state;
    return (
      <StyledBanner>
        {bannerImages.map((banner, index) => {
          return (
            <div
              key={index}
              className={classNames(
                'mb-slide',
                {
                  'active-mb-slide fade-in': this.activeSlideIndex == index,
                },
                {
                  'prev-slide fade-out': this.prevSlideIndex == index,
                }
              )}
            >
              {isClient
                ? this.renderBanners({ url: banner.url, alt: banner.alt })
                : null}
            </div>
          );
        })}

        <div
          className={`mb-captions ${
            bannerImages.length > 1 ? 'with-indicators' : ''
          }`}
        >
          <div className="mb-caption">
            <div className="caption">
              <h1>{bannerHeading}</h1>
            </div>
            <StyledButton>
              <Button type="whiteBordered" onClick={this.scrollTicketSection}>
                {labels[currentLanguage].BANNER_CTA}
              </Button>
            </StyledButton>
          </div>
        </div>
        {this.hasIndicators && bannerImages.length > 1 ? (
          <div className="indicators">
            {bannerImages.map((_banner, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                className={classNames('indicator', {
                  active: this.activeSlideIndex == index,
                })}
                onClick={() => {
                  this.slideTo(index);
                }}
              />
            ))}
          </div>
        ) : null}
      </StyledBanner>
    );
  }
}
