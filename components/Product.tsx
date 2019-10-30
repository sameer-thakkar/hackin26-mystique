import React, { Component } from "react";
import { shortCodeSerializer } from "../utils/shortCodes";
import { RichText } from "prismic-reactjs";
import ReactMarkdown from "react-markdown";
import parse from "url-parse";
import * as labels from "../static/localization/labels";

const isLengthyArray = item => Array.isArray(item) && item.length;

export default class Product extends Component<any, any> {
  readMoreRef: any;
  constructor(props) {
    super(props);
    this.readMoreRef = React.createRef();
  }

  readMore = context => {
    const { currentLanguage } = this.props;
    let desc = context.previousElementSibling;
    let more = context;
    if (more.dataset.open == 0) {
      more.innerHTML = `- ${labels[currentLanguage].SHOW_LESS_TEXT}`;
      more.style.background = "none";
      desc.style.transition = "all 0.15s ease-in-out";
      desc.style.height = "auto";
      more.dataset.open = 1;
    } else if (more.dataset.open == 1) {
      more.innerHTML = `+ ${labels[currentLanguage].READ_MORE_TEXT}`;
      more.style.background =
        "linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.7),rgba(255,255,255,1))";
      desc.style.transition = "all 0.15s ease-in-out";
      desc.style.height = "8.125em";
      more.dataset.open = 0;
    }
  };

  handlePopup = () => {
    const { togglePopup } = this.props;
    this.sendPopupViewedEvent();
    togglePopup();
  };

  sendBookNowEvent = () => {
    this.props.trackEvent({
      eventName: "Book Now Clicked",
      tgid: this.props.tgid
    });
  };

  sendPopupViewedEvent = () => {
    this.props.trackEvent({
      eventName: "Popup Viewed",
      popupType: "FreeTour",
      tgid: this.props.tgid
    });
  };

  render() {
    const {
      title,
      descriptors,
      highlights,
      tgid,
      tourPrices,
      uid,
      currencySymbol,
      currentLanguage,
      hasOffer,
      productOffer,
      offerId,
      isMobile,
      isFetched,
      popupState,
      scorpioData,
      pageUrl,
      host,
      isScratchPriceEnabled
    } = this.props;
    const descriptorsCsv = descriptors || scorpioData.descriptors;
    const cardTitle = title || scorpioData.title;
    const descriptorsList = descriptorsCsv ? descriptorsCsv.split(",") : [];
    let url = host || window.location.host;
    const isDev = url.includes("localhost");
    const currentHost = !isDev ? url : parse(uid, true).pathname;
    const hostName = currentHost.includes("stage")
      ? currentHost.replace("stage.", "")
      : currentHost;
    let hostSplit = hostName.split(".");
    hostSplit.shift();
    const bookingUrl = hostSplit.join(".");
    const showScratchPrice = isFetched && isScratchPriceEnabled;

    const isHighlightsFromPrismic =
      isLengthyArray(highlights) && highlights.filter(item => item.text).length;
    return (
      <div>
        <div className="product">
          <div className="product-header">
            <div className="product-header-left">
              <h2 className="product-title">{cardTitle}</h2>
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
                offerId &&
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
              <div className="price-container">
                {showScratchPrice &&
                tourPrices[tgid].scratchPrice > tourPrices[tgid].price ? (
                  <div className="product-scratch-price">
                    {tourPrices[tgid].scratchPrice
                      ? `${currencySymbol}${tourPrices[tgid].scratchPrice}`
                      : null}
                  </div>
                ) : null}
                {isFetched ? (
                  <div className="product-price">
                    {tourPrices[tgid].price
                      ? `${currencySymbol}${tourPrices[tgid].price}`
                      : null}
                  </div>
                ) : null}
              </div>
              <a
                target={isFetched && isMobile() ? null : "_blank"}
                href={`http://book.${bookingUrl}${
                  currentLanguage === "en" ? "" : `/${currentLanguage}`
                }/book/${tgid}`}
              >
                <div
                  className={`book-now-cta ${
                    currentLanguage == "fr" ? "fr-book-now-cta" : ""
                  }`}
                  onClick={this.sendBookNowEvent}
                >
                  <span className="book-now-text">
                    {labels[currentLanguage].BOOK_NOW_CTA}
                  </span>
                </div>
              </a>
            </div>
          </div>
          {hasOffer && offerId && isMobile && (
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
              {isHighlightsFromPrismic ? (
                <ul>
                  {highlights
                    .filter(item => item.text)
                    .map((highlight, index) => (
                      <li key={index}>{highlight.text}</li>
                    ))}
                </ul>
              ) : (
                <ReactMarkdown source={scorpioData.highlights} />
              )}
            </div>
            <div
              ref={this.readMoreRef}
              data-open="0"
              onClick={() => this.readMore(this.readMoreRef.current)}
              className="read-more"
            >
              {`+ ${labels[currentLanguage].READ_MORE_TEXT}`}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
