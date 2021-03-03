import React, { Component } from 'react';
import classNames from 'classnames';
import { scroller } from 'react-scroll';
import { strings } from 'const/strings';
import { withShortcodes } from 'utils/helper';
import { MBContext } from 'contexts/MBContext';
import { SOLEIL, COLORS } from 'const/ui-constants';
import styled from 'styled-components';

import Button from './UI/Button';
import Image from './UI/Image';
import Conditional from './common/Conditional';

const StyledBanner = styled.div`
  display: grid;
  height: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.16);
  font-family: ${SOLEIL.FONT_STACK};
  margin-bottom: 24px;

  .mb-slide {
    display: none;
    .image-wrap {
      display: block;
    }
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
    background: #22222299;
  }

  .absolute-position {
    position: absolute;
  }

  .mb-captions .caption h1,
  .mb-captions .caption .h1 {
    font-size: 24px;
    color: #fff;
    line-height: 1.2;
  }

  .mb-captions,
  .mb-slide.active-mb-slide,
  .mb-slide.prev-slide {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .mb-captions .mb-caption {
    opacity: 0;
    grid-row: 1;
    grid-column: 1 / 2;
    display: grid;
    align-self: center;
    grid-gap: 14px;
    justify-items: center;
    transition: opacity 0.3s ease-in-out;
    .tag {
      justify-self: center;
    }
  }
  p {
    color: ${COLORS.WHITE};
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    margin-top: 0;
    margin-bottom: 12px;
  }
  .mb-captions .df-caption {
    grid-row-gap: 12px;
    h1,
    .h1 {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }

  .mb-captions .df-caption {
    grid-row-gap: 12px;
    h1,
    .h1 {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }

  .mb-captions .mb-caption.active {
    opacity: 1;
    z-index: 10;
  }
  .mb-captions .mb-cta {
    background-color: rgba(0, 0, 0, 0.35);
    border: solid white 1px;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 1.2px;
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
    .mb-captions .mb-caption {
      justify-items: left;
      margin-bottom: 24px;
      margin-left: 16px;
      max-width: 85%;
      z-index: 1;
    }
    .mb-captions.with-indicators .mb-caption {
      margin-bottom: 56px;
      align-self: end;
    }

    .mb-captions {
      place-content: unset;
      text-align: left;
      align-items: end;
      background: unset;
      .caption h1,
      .caption .h1 {
        font-weight: 500;
        font-size: 20px;
        line-height: 120%;
        margin: 0;
      }
    }
    .mb-captions .df-caption {
      .tag {
        justify-self: left;
      }
      h1,
      .h1 {
        margin-bottom: 12px;
      }
      p {
        margin: 0;
      }
    }

    .mb-captions::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: ${COLORS.TWO_BLACK};
      z-index: 0;
      opacity: 0.4;
    }

    .mb-captions .non-opaque {
      opacity: 1;
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
    .banner-image {
      object-fit: cover;
      img {
        object-fit: cover;
        object-position: 20% 10%;
      }
    }
  }
`;

export const BANNER_PARAMS = {
  DESKTOP: {
    ASPECT_RATIO: '4.5:1',
    WIDTH: '1200',
  },
  MOBILE: {
    ASPECT_RATIO: '1:1.07',
    WIDTH: '500',
  },
};

const ButtonWrapper = styled.div`
  @media (max-width: 768px) {
    button {
      font-size: 14px;
      padding: 13px 25px;
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
    this.SLIDE_CHANGE_INTERVAL = 5000;
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
    if (this.props.bannerImages.length > 1) {
      setTimeout(this.autoSlide, 2500);
    }
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

  renderBanners = (image, index) => {
    const { isAmp } = this.props;
    const { url, alt, mobileUrl } = image;
    const { isMobile } = this.state;
    const { ASPECT_RATIO, WIDTH } =
      isMobile || isAmp ? BANNER_PARAMS.MOBILE : BANNER_PARAMS.DESKTOP;

    return (
      <Image
        width={WIDTH}
        aspectRatio={ASPECT_RATIO}
        url={url}
        dontLazyLoad={index === 0}
        mobileUrl={mobileUrl}
        alt={alt || 'banner'}
      />
    );
  };

  renderAmpBanners = (image) => {
    const { url, alt } = image;
    return (
      <Image
        width="411"
        height="400"
        url={url}
        alt={alt || 'banner'}
        layout={'fill'}
        className="banner-image"
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

  getAmpBanner = (bannerImages) => (
    <amp-carousel
      width="411"
      height="400"
      layout="responsive"
      type="slides"
      autoplay=""
      delay="4000"
    >
      {bannerImages.map((banner) =>
        this.renderAmpBanners({ url: banner.url, alt: banner.alt })
      )}
    </amp-carousel>
  );

  render() {
    const {
      bannerHeading: tempBannerHeading,
      bannerImages,
      hideCTA,
      isAmp,
      dfExpiryDate,
      bannerSubtext: tempBannerSubtext,
      bannerCtaText = '',
    } = this.props;
    const bannerHeading = withShortcodes(tempBannerHeading);
    const bannerSubtext = withShortcodes(tempBannerSubtext);
    const captions = (
      <div
        className={`mb-captions ${
          bannerImages.length > 1 ? 'with-indicators' : ''
        }
        ${isAmp ? 'absolute-position' : ''}
        `}
      >
        <div
          className={`${isAmp ? 'non-opaque' : ''} mb-caption
        `}
        >
          <div className="caption">
            <h1>{bannerHeading}</h1>
          </div>
          {hideCTA ? null : (
            <ButtonWrapper>
              <Button
                type="whiteBordered"
                onClick={this.scrollTicketSection}
                on="tap:tour-list-heading.scrollTo(duration='1200', position='top')"
              >
                {bannerCtaText || strings.BANNER_CTA}
              </Button>
            </ButtonWrapper>
          )}
        </div>
      </div>
    );
    if (isAmp)
      return (
        <StyledBanner>
          {this.getAmpBanner(bannerImages)}
          {captions}
        </StyledBanner>
      );

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
              {this.renderBanners(banner, index)}
            </div>
          );
        })}
        <div
          className={`mb-captions ${
            bannerImages.length > 1 ? 'with-indicators' : ''
          }`}
        >
          <div
            className={`mb-caption ${
              dfExpiryDate ? this.activeSlideIndex !== 1 && 'active' : 'active'
            }`}
          >
            <div className="caption">
              <h1>{bannerHeading}</h1>
              <Conditional if={bannerSubtext}>
                <p>{bannerSubtext}</p>
              </Conditional>
            </div>
            <Conditional if={!hideCTA}>
              <ButtonWrapper>
                <Button type="whiteBordered" onClick={this.scrollTicketSection}>
                  {bannerCtaText || strings.BANNER_CTA}
                </Button>
              </ButtonWrapper>
            </Conditional>
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

Banner.contextType = MBContext;
