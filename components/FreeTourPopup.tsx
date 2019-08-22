import React, { Component } from "react";
import InlinePrice from "./InlinePrice";
import Swiper from "react-id-swiper";

export default class FreeTourPopup extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  handlePopup = () => {
    const { togglePopup } = this.props;
    togglePopup();
  };

  renderSlider = () => {
    const { productOffer, hasOffer } = this.props;
    const params = {
      direction: "horizontal",
      pagination: {
        el: ".swiper-pagination"
      },
      speed: 650,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      }
    };

    return (
      <Swiper {...params}>
        {hasOffer &&
          productOffer.map(data => {
            return data.data.carousel_images.map((image, index) => {
              return (
                <div key={index} className="swiper-slide">
                  <img
                    src={image.image_url.url || image.image_source.url || null}
                    alt=""
                  />
                </div>
              );
            });
          })}
      </Swiper>
    );
  };

  render() {
    const { productOffer, popupState, hasOffer } = this.props;

    return (
      <div className={`popupv2-cont ${popupState ? "active" : ""}`}>
        <div className="popupv2-wrap">
          <div className="carousel">
            <div className="swiper-container">
              <div className="swiper-wrapper">{this.renderSlider()}</div>

              <div className="swiper-pagination"></div>
            </div>
          </div>

          <div className="popupv2-contents">
            <div onClick={this.handlePopup} className="close-trigger close">
              <img
                src="https://cdn-imgix-open.headout.com/icons/cancel-icon.svg"
                alt=""
                className=""
              />
            </div>

            <div className="contents">
              <div className="sub-title">Book Now & Get This Tour For Free</div>
              <div className="title">
                {hasOffer &&
                  productOffer.map(offer => offer.data.tour_heading_override)}
              </div>
              <div className="scratch-price">
                <span className="price_10481"></span>
                <InlinePrice tgid={10481} />
              </div>
              <div className="price">FREE</div>
              <div className="popupv2-list">
                <ul>
                  {hasOffer &&
                    productOffer.map(offer => {
                      return offer.data.tour_description_override.map(
                        (description, index) => {
                          return <li key={index}>{description.text}</li>;
                        }
                      );
                    })}
                </ul>
              </div>
            </div>
            <div
              onClick={this.handlePopup}
              className="close-trigger popupv2-cta"
            >
              Okay, Got It
            </div>
          </div>
        </div>
        <div onClick={this.handlePopup} className="mask close-trigger"></div>
      </div>
    );
  }
}
