import React, { Component } from 'react';
import classNames from 'classnames';
import { scroller } from 'react-scroll';
import * as labels from '../public/static/localization/labels';
import Button from './UI/Button';
import Image from './UI/Image';

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
    const { bannerHeading, bannerImages, boxed, currentLanguage } = this.props;
    const { isClient } = this.state;
    return (
      <div className={classNames('mb-carousel', { boxed: boxed })}>
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

        <div className="mb-captions">
          <div className="mb-caption">
            <div className="caption">
              <h1>{bannerHeading}</h1>
            </div>
            <Button type="whiteBordered" onClick={this.scrollTicketSection}>
              {labels[currentLanguage].BANNER_CTA}
            </Button>
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
      </div>
    );
  }
}
