import React, { Component } from "react";
import { shortCodeSerializer } from "../utils/shortCodes";
import { RichText } from "prismic-reactjs";

export default class Product extends Component<any, any> {
  readMoreRef: any;
  constructor(props) {
    super(props);
    this.readMoreRef = React.createRef();
  }

  readMore = context => {
    const { readMoreText, showLessText } = this.props;
    let desc = context.previousElementSibling;
    let more = context;
    if (more.dataset.open == 0) {
      more.innerHTML = `${showLessText}`;
      more.style.background = "none";
      desc.style.transition = "all 0.15s ease-in-out";
      desc.style.height = "auto";
      more.dataset.open = 1;
    } else if (more.dataset.open == 1) {
      more.innerHTML = `${readMoreText}`;
      more.style.background =
        "linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.7),rgba(255,255,255,1))";
      desc.style.transition = "all 0.15s ease-in-out";
      desc.style.height = "8.125em";
      more.dataset.open = 0;
    }
  };

  handlePopup = () => {
    const { togglePopup } = this.props;
    togglePopup();
  };

  render() {
    const {
      title,
      descriptors,
      highlights,
      tgid,
      tourPrices,
      currentDomain,
      currencySymbol,
      currentLanguage,
      bookNowText,
      readMoreText,
      hasOffer,
      productOffer,
      offerId,
      isMobile,
      popupState
    } = this.props;
    const descriptorsList = descriptors.split(",");
    const langCode = currentLanguage.substring(0, 2);
    const domainSplit = currentDomain.split(".");
    const domain = domainSplit[1] + "." + domainSplit[2];
    return (
      <div>
        <div className="product">
          <div className="product-header">
            <div className="product-header-left">
              <div className="product-title">{title}</div>
              <div className="product-tags">
                {descriptorsList.map((tag, index) => {
                  return (
                    <span key={index} className="product-tag">
                      {tag} <span className="bullet">•</span>
                    </span>
                  );
                })}
              </div>
              {hasOffer &&
                productOffer.map((offer, index) => {
                  if (offer.id === offerId) {
                    return (
                      <div
                        key={index}
                        onClick={this.handlePopup}
                        className="product-offer"
                      >
                        <RichText
                          render={offer.data.offer_title}
                          htmlSerializer={shortCodeSerializer}
                        />
                      </div>
                    );
                  }
                })}
            </div>
            <div className="product-header-right">
              <div className="product-price">
                {tourPrices.map(price => {
                  if (price.tgid == tgid) {
                    return `${currencySymbol}${price.price}`;
                  }
                })}
              </div>
              <a
                target="_blank"
                href={`http://book.${domain}${
                  langCode === "en" ? "" : `/${langCode}`
                }/book/${tgid}`}
              >
                <div
                  className="book-now-cta"
                  style={langCode == "fr" ? { width: "12.5em" } : {}}
                >
                  <span className="book-now-text">{bookNowText}</span>
                </div>
              </a>
            </div>
          </div>
          {hasOffer && isMobile && (
            <div onClick={this.handlePopup} className="product-offer-mobile">
              <div className="product-offer-mobile-left">
                <div className="gift-image">
                  <img
                    src="https://cdn-imgix-open.headout.com/new-product-card/line expand.svg"
                    alt="gift-image"
                  />
                </div>
                <div className="product-offer-text">
                  {productOffer.map((offer, index) => {
                    if (offer.id === offerId) {
                      return (
                        <RichText
                          key={index}
                          render={offer.data.offer_title}
                          htmlSerializer={shortCodeSerializer}
                        />
                      );
                    }
                  })}
                </div>
              </div>
              <div className="product-offer-mobile-right">
                <div className="product-offer-arrow">
                  <img src="https://cdn-imgix-open.headout.com/new-product-card/Path 24.svg" />
                </div>
              </div>
            </div>
          )}
          <div className="desc-wrapper">
            <div className="product-desc">
              <ul>
                {highlights.map((highlight, index) => (
                  <li key={index}>{highlight.text}</li>
                ))}
              </ul>
            </div>
            <div
              ref={this.readMoreRef}
              data-open="0"
              onClick={() => this.readMore(this.readMoreRef.current)}
              className="read-more"
            >
              {readMoreText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
