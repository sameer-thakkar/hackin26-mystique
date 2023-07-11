import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import type { SwiperProps } from 'swiper/react';
import Image from 'UI/Image';
import { isMobile } from 'utils/helper';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';
import InlinePrice from './InlinePrice';

const Swiper = dynamic(() => import('components/Swiper'));

const StyledFTPopup = styled.div`
  .popupv2-wrap.pixel-fix * {
    -webkit-perspective: 1000;
    -webkit-transform: translate3d(0, 0, 0);
  }
  .swiper-container {
    width: 100%;
    height: max-content;
    height: 692px;
    height: 100%;
  }

  .swiper-pagination.swiper-pagination-bullets {
    bottom: 18px;
  }

  span.swiper-pagination-bullet {
    background: #ffffffa1;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background: #fff !important;
  }
  .carousel {
    height: 100%;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
  }

  .popupv2-wrap {
    display: grid;
    grid-template-columns: 42.5% 57.5%;
    max-width: 1164px;
    /* margin: auto; */
    /*  width: 1164px;*/
    /*height:692px;*/
    /* height: 84%;
width: 80%; */
    grid-row: 1;
    grid-column: 1 / 2;
    /*background: #fff;*/
  }

  .popupv2-cont * {
    /*box-sizing: content-box;*/
  }

  .popupv2-cont {
    min-height: 100%;
    min-width: 100%;
    height: 100%;
    width: 100%;

    position: fixed;
    top: 0;
    left: 0;
    display: none;
    align-items: center;
    justify-items: center;
    grid-template-columns: 1fr;
    z-index: 9999;
  }

  .popupv2-cont.active {
    display: grid;
  }

  .carousel img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mask {
    grid-row: 1;
    grid-column: 1 / 2;
    background: rgba(0, 0, 0, 0.4);
    height: 100%;
    width: 100%;
    opacity: 0.4;
    z-index: -1;
  }

  .popupv2-contents {
    padding: 80px 70px;
    padding: 11.9% 10.4%;
    padding: 70px;
    background: #fff;
    display: grid;
    align-content: center;
    position: relative;
  }

  .popupv2-contents .close {
    position: absolute;
    top: 25px;
    right: 25px;
    height: 26px;
    width: 26px;
    filter: invert(0.5);
    cursor: pointer;
  }
  .popupv2-contents .close img {
    height: 100%;
    width: 100%;
    display: block;
  }

  .sub-title {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 22px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.27;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    margin-bottom: 12px;
  }

  .title {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 26px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.31;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .scratch-price {
    opacity: 0.6;
    text-decoration: line-through;
    font-family: ${HALYARD.FONT_STACK};
    font-size: 18px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #444444;
    margin-bottom: 8px;
  }

  .price {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 28px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.32;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    margin-bottom: 24px;
  }

  .popupv2-list li {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.38;
    letter-spacing: normal;
    text-align: left;
    color: #444444;
    margin-bottom: 8px;
  }

  .popupv2-list {
    margin-bottom: 32px;
  }

  .popupv2-list ul {
    list-style: disc;
    padding-left: 20px;
  }

  .popupv2-cta {
    background-color: ${COLORS.BRAND.PURPS};
    font-family: ${HALYARD.FONT_STACK};
    font-size: 16px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.31;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    padding: 16px 100px;
    justify-self: left;
    cursor: pointer;
    text-transform: uppercase;
  }

  .popupv2-cont .contents {
    display: contents;
  }

  @media (max-width: 768px) {
    .popupv2-wrap {
      width: 100%;
    }

    .popupv2-cont {
      background: #fff;
    }
    .popupv2-cont.active {
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      /* height: unset; */
    }

    .swiper-container {
      height: 100%;
    }

    .mask {
      display: none;
    }
    .swiper-pagination.swiper-pagination-bullets {
      bottom: 5px;
    }

    .popupv2-wrap {
      grid-template-columns: 1fr;
      grid-template-rows: 30% 70%;
      grid-template-rows: 220px 1fr;
      align-items: start;
      width: 100vw;
    }
    .popupv2-wrap .contents {
      display: grid;
      /*height: calc(100vh - 220px - 50px);*/
      /*overflow: scroll;*/
      /*-webkit-overflow-scrolling: touch;*/
      padding: 30px 24px;
      padding-top: 0;
    }
    .popupv2-wrap .contents::before {
      content: '';
      height: 30px;
      display: block;
    }
    .popupv2-contents {
      padding: 0;
      position: unset;
      max-width: unset;
      grid-template-rows: 1fr 50px;
    }

    .popupv2-contents .close {
      top: 0;
      right: 0;
      padding: 16px;
      background: #000;
      filter: unset;
      height: auto;
      width: auto;
      z-index: 99;
      position: fixed;
      display: flex;
    }
    .popupv2-contents .close img {
      filter: invert(0);
    }

    .carousel img {
      width: 100%;
    }

    .sub-title {
      margin-bottom: 10px;
      font-size: 18px;
    }

    .title {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .scratch-price {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .price {
      font-size: 17px;
    }

    .popupv2-list li {
      font-size: 16px;
      line-height: 1.6;
    }

    .popupv2-cta {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 14px 0;
      font-size: 18px;
    }
    .popupv2-list {
      margin-bottom: 40px;
    }
  }
`;
export default class FreeTourPopup extends Component<any, any> {
  FTPopupElement: any;
  FTWrapElement: any;
  constructor(props: any) {
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

  handlePopup = (
    _e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    _closeType: string,
    url: string | null
  ) => {
    if (url) {
      return (window.location.href = url);
    }
    const { togglePopup } = this.props;
    togglePopup();
  };

  renderSlider = (productOffer: any) => {
    const params: SwiperProps = {
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
    };

    return (
      <Swiper {...params}>
        {productOffer.data.carousel_images.map((image: any, index: number) => {
          return (
            <div key={index} className="swiper-slide">
              <Image
                url={image.image_url.url || image.image_source.url || null}
                format="pjpg"
                alt={'offer'}
              />
            </div>
          );
        })}
      </Swiper>
    );
  };

  renderImage = (image: any) => {
    if (image)
      return (
        <Image
          url={image.image_url.url || image.image_source.url || null}
          alt={''}
        />
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
      <StyledFTPopup>
        <div
          className={`popupv2-cont ${popupState ? 'active' : ''}`}
          ref={(FTWrapElement) => {
            this.FTWrapElement = FTWrapElement;
          }}
        >
          <div
            className={
              'popupv2-wrap ' + (this.state.scaleSet ? 'pixel-fix' : null)
            }
            ref={(FTPopupElement) => {
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
                onClick={(e) => this.handlePopup(e, 'Close', null)}
                className="close-trigger close"
                role="button"
                onKeyDown={(e) => this.handlePopup(e, 'Close', null)}
                tabIndex={0}
              >
                <Image
                  height={26}
                  width={26}
                  url="https://cdn-imgix-open.headout.com/icons/cancel-icon.svg"
                  format="pjpg"
                  alt={'cancel'}
                />
              </div>

              <div className="contents">
                <div className="sub-title">
                  {productOffer.data.popup_heading}
                </div>
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
                      {productOfferHighlights.map(
                        (description: any, index: number) => {
                          return <li key={index}>{description.text}</li>;
                        }
                      )}
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
                  onClick={(e) =>
                    this.handlePopup(e, 'CTA', productOffer.data.cta_url)
                  }
                  className="close-trigger popupv2-cta"
                  role="button"
                  onKeyDown={(e) =>
                    this.handlePopup(e, 'CTA', productOffer.data.cta_url)
                  }
                  tabIndex={0}
                >
                  {productOffer.data.cta_text || 'Okay, Got It!'}
                </div>
              }
            </div>
          </div>
          <div
            onClick={(e) => this.handlePopup(e, 'OutsidePopup', null)}
            className="mask close-trigger"
            role="button"
            onKeyDown={(e) => this.handlePopup(e, 'OutsidePopup', null)}
            tabIndex={0}
          ></div>
        </div>
      </StyledFTPopup>
    );
  }
}
