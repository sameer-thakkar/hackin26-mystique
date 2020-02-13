import React, { Component } from 'react';
import { shortCodeSerializer } from '../utils/shortCodes';
import { RichText } from 'prismic-reactjs';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import parse from 'url-parse';
import classNames from 'classnames';
import * as labels from '../public/static/localization/labels';
import { ANALYTICS_EVENTS } from '../constants';
import { COLORS } from '../constants/ui-constants';

const isLengthyArray = item => Array.isArray(item) && item.length;

export default class Product extends Component<any, any> {
  readMoreRef: any;
  constructor(props) {
    super(props);
    this.readMoreRef = React.createRef();
  }

  readMore = context => {
    const { currentLanguage, analytics } = this.props;
    let desc = context.previousElementSibling;
    let more = context;
    if (more.dataset.open == 0) {
      more.innerHTML = `- ${labels[currentLanguage].SHOW_LESS_TEXT}`;
      more.style.background = 'none';
      desc.style.transition = 'all 0.15s ease-in-out';
      desc.style.height = 'auto';
      more.dataset.open = 1;
      analytics.setVariableInDataLayer({
        event: ANALYTICS_EVENTS.EXPERIENCE_DETAILS_VIEWED,
        'Tour Group Id': this.props.tgid,
      });
    } else if (more.dataset.open == 1) {
      more.innerHTML = `+ ${labels[currentLanguage].READ_MORE_TEXT}`;
      more.style.background =
        'linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.7),rgba(255,255,255,1))';
      desc.style.transition = 'all 0.15s ease-in-out';
      desc.style.height = '8.125em';
      more.dataset.open = 0;
    }
  };

  handlePopup = () => {
    const { togglePopup } = this.props;
    togglePopup();
  };
  sendBookNowEvent = () => {
    const { analytics, tgid, position } = this.props;
    analytics.setVariableInDataLayer({
      event: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      'Tour Group Id': tgid,
      Position: position,
      'Div Type': 'product-list',
    });
  };

  getDate = (date, currentLanguage) => {
    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment()
      .add(1, 'days')
      .format('YYYY-MM-DD');
    if (date === today) return labels[currentLanguage].TODAY;
    if (date === tomorrow) return labels[currentLanguage].TOMORROW;
    return moment(date)
      .locale(currentLanguage)
      .format('MMM Do');
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
      earliestAvailability,
      ctaUrlSuffix,
      isScratchPriceEnabled,
      booster,
    } = this.props;
    const descriptorsCsv = descriptors || scorpioData.descriptors;
    const cardTitle = title || scorpioData.title;
    const descriptorsList = descriptorsCsv ? descriptorsCsv.split(',') : [];
    let url = host || window.location.host;
    const isDev = url.includes('localhost');
    const currentHost = !isDev ? url : parse(uid, true).pathname;
    const hostName = currentHost.includes('stage')
      ? currentHost.replace('stage.', '')
      : currentHost;
    let hostSplit = hostName.split('.');
    hostSplit.shift();
    const bookingUrl = hostSplit.join('.');
    const showScratchPrice = isFetched && isScratchPriceEnabled;

    const isHighlightsFromPrismic =
      isLengthyArray(highlights) && highlights.filter(item => item.text).length;

    return (
      <div
        className={classNames('product', {
          'product__with-date': earliestAvailability,
        })}
        id={tgid}
      >
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
            <div className="v1-booster">
              <RichText render={booster} htmlSerializer={shortCodeSerializer} />
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
            {/* {earliestAvailability && (
                <div className="earliest-availability left">
                  {`${labels[currentLanguage].NEXT_AVAILABLE}: `}
                  <span>
                    {this.getDate(earliestAvailability, currentLanguage)}
                  </span>
                </div>
              )} */}
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
            {earliestAvailability && (
              <div className="earliest-availability bottom">
                {`${labels[currentLanguage].NEXT_AVAILABLE}: `}
                <span>
                  {this.getDate(earliestAvailability, currentLanguage)}
                </span>
              </div>
            )}
            <a
              target={isFetched && isMobile() ? null : '_blank'}
              href={`http://book.${bookingUrl}${
                currentLanguage === 'en' ? '' : `/${currentLanguage}`
              }/book/${tgid}${ctaUrlSuffix}`}
            >
              <div
                className={classNames(
                  'book-now-cta',
                  {
                    'book-now-cta__with-date': earliestAvailability,
                  },
                  {
                    'fr-book-now-cta': currentLanguage == 'fr',
                  }
                )}
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
                  className="lazyload"
                  data-src="https://cdn-imgix-open.headout.com/new-product-card/line%20expand.svg"
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
                <img
                  data-src="https://cdn-imgix-open.headout.com/new-product-card/Path%2024.svg"
                  className="lazyload"
                  alt="image"
                />
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
        <style jsx>{`
          .v1-booster {
            font-family: Graphik;
            font-weight: 400;
            line-height: 1.31;
            text-align: left;
            color: ${COLORS.TEAL};
            margin-top: 4px;
            font-size: 1em;
            margin-bottom: 0;
            grid-column: 1/3;
            display: inline-block;
          }
        `}</style>
        <style global jsx>{`
          .v1-booster p {
            margin: 0;
          }
        `}</style>
      </div>
    );
  }
}
