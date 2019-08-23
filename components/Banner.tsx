import React, { Component } from "react";

export default class Banner extends Component<any, any> {
  hasIndicators: boolean;
  MAX_SLIDES: number;
  SLIDE_CHANGE_INTERVAL: number;
  activeSlideIndex: number;
  MB_CAROUSEL_INT: any;
  constructor(props) {
    super(props);
    this.hasIndicators = true;
    this.MAX_SLIDES = this.props.bannerImages.length;
    this.SLIDE_CHANGE_INTERVAL = 3500;
    this.activeSlideIndex = 0;
    this.state = { counter: 0 };
  }

  componentDidMount() {
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

  render() {
    const { bannerCtaText, bannerHeading, bannerImages } = this.props;
    return (
      <div className="mb-carousel boxed">
        {bannerImages.map((banner, index) => {
          return (
            <div
              key={index}
              className={
                "mb-slide " +
                (this.activeSlideIndex == index ? "active-mb-slide" : "")
              }
            >
              <img
                src={banner.image_src.url || banner.uploaded_image.url}
                alt=""
              />
            </div>
          );
        })}

        <div className="mb-captions">
          <div className="mb-caption">
            <div className="caption">{bannerHeading}</div>
            <a className="mb-cta book-now-text" href="#select-tickets">
              {bannerCtaText}
            </a>
          </div>
        </div>
        {this.hasIndicators && bannerImages.length > 1 ? (
          <div className="indicators">
            {bannerImages.map((banner, index) => (
              <div
                className={
                  "indicator " +
                  (this.activeSlideIndex == index ? "active" : "")
                }
                onClick={() => {
                  this.slideTo(index);
                }}
              ></div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
