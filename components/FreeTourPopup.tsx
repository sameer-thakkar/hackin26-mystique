import React, { Component } from 'react';
import InlinePrice from './InlinePrice';
import Swiper from './Swiper';
import Image from './UI/Image';
import { isMobile } from '../utils/helper';

export default class FreeTourPopup extends Component<any, any> {
  FTPopupElement: any;
  FTWrapElement: any;
  constructor(props) {
    super(props);
    this.state = {
      isClient: false,
      scaleStyles: {},
      scaleSet: false,
    };
  }
  componentDidMount() {
    this.setState({
      isClient: true,
    });
  }

  componentDidUpdate() {
    // Hack to find the CSS Transform Scale Down Value Iteratively till Popup Fits Screen (+guttter)
    if (this.props.popupState && !this.state.scaleSet && !isMobile()) {
      let parentHeight = this.FTWrapElement.clientHeight; //Parent Height is same as Screen Height
      let popupHeight = this.FTPopupElement.clientHeight;
      if (popupHeight > parentHeight) {
        let scaleFactor = 1;
        while (scaleFactor * popupHeight + 20 > parentHeight) {
          scaleFactor -= 0.01;
        }
        this.setState({
          scaleStyles: {
            transform: `translate(-50%, -50%)  scale3d(${scaleFactor}, ${scaleFactor}, ${scaleFactor})`,
            position: 'fixed',
            left: '50%',
            top: '50%',
          },
          scaleSet: true,
        });
      }
    }
  }

  handlePopup = (e, closeType, url) => {
    if (url) {
      return (window.location.href = url);
    }
    const { togglePopup } = this.props;
    const clickedElement = e.target;
    togglePopup();
  };

  renderSlider = productOffer => {
    const isMobile = () => {
      return document.documentElement.clientWidth < 768;
    };
    const height = isMobile() ? 400 : 750;
    const width = isMobile() ? 495 : 495;
    const params = {
      direction: 'horizontal',
      pagination: {
        el: '.swiper-pagination',
      },
      speed: 650,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      rebuildOnUpdate: true,
    };

    return (
      <Swiper {...params}>
        {productOffer.data.carousel_images.map((image, index) => {
          return (
            <div key={index} className="swiper-slide">
              <Image
                url={image.image_url.url || image.image_source.url || null}
                format="pjpg"
              />
            </div>
          );
        })}
      </Swiper>
    );
  };

  renderImage = image => {
    if (image)
      return (
        <Image url={image.image_url.url || image.image_source.url || null} />
      );
  };

  render() {
    if (!this.state.isClient) {
      return null;
    }
    const { productOffer, popupState, scorpioData } = this.props;
    const offer_tgid = productOffer.data.offer_tgid;
    const productOfferHighlights =
      productOffer.data.tour_description_override.length > 0
        ? productOffer.data.tour_description_override
        : '';
    return (
      <div
        className={`popupv2-cont ${popupState ? 'active' : ''}`}
        ref={FTWrapElement => {
          this.FTWrapElement = FTWrapElement;
        }}
      >
        <div
          className={
            'popupv2-wrap ' + (this.state.scaleSet ? 'pixel-fix' : null)
          }
          ref={FTPopupElement => {
            this.FTPopupElement = FTPopupElement;
          }}
          style={this.state.scaleStyles}
        >
          <div className="carousel">
            <div className="swiper-container">
              <div className="swiper-wrapper">
                {productOffer.data.carousel_images.length > 1
                  ? this.renderSlider(productOffer)
                  : this.renderImage(productOffer.data.carousel_images[0])}
              </div>

              <div className="swiper-pagination"></div>
            </div>
          </div>

          <div className="popupv2-contents">
            <div
              onClick={e => this.handlePopup(e, 'Close', null)}
              className="close-trigger close"
            >
              <Image
                height={26}
                width={26}
                url="https://cdn-imgix-open.headout.com/icons/cancel-icon.svg"
                format="pjpg"
              />
            </div>

            <div className="contents">
              <div className="sub-title">{productOffer.data.popup_heading}</div>
              <div className="title">
                {productOffer.data.tour_heading_override ||
                  scorpioData[offer_tgid].productTitle}
              </div>
              <div className="scratch-price">
                <span className="price_10481"></span>
                <InlinePrice tgid={offer_tgid} />
              </div>
              {productOffer.data.show_free_label === 'Yes' && (
                <div className="price">FREE</div>
              )}

              {productOfferHighlights.length ? (
                <div className="popupv2-list">
                  <ul>
                    {productOfferHighlights.map((description, index) => {
                      return <li key={index}>{description.text}</li>;
                    })}
                  </ul>
                </div>
              ) : (
                <div
                  className="popupv2-list"
                  dangerouslySetInnerHTML={{
                    __html: scorpioData[offer_tgid].productHighlights,
                  }}
                />
              )}
            </div>

            {
              <div
                onClick={e =>
                  this.handlePopup(e, 'CTA', productOffer.data.cta_url)
                }
                className="close-trigger popupv2-cta"
              >
                {productOffer.data.cta_text || 'Okay, Got It!'}
              </div>
            }
          </div>
        </div>
        <div
          onClick={e => this.handlePopup(e, 'OutsidePopup', null)}
          className="mask close-trigger"
        ></div>
      </div>
    );
  }
}
