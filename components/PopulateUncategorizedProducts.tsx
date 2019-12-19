import React, { Component } from "react";
import Product from "./Product";
import * as labels from "../static/localization/labels";

export default class PopulateUncategorizedProducts extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isClient: false
    };
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({
        isClient: true
      });
    });
  }

  render() {
    const {
      uncategorizedTours: tours,
      tourPrices,
      currencySymbol,
      uid,
      currentLanguage,
      bookNowText,
      showLessText,
      readMoreText,
      productOffer,
      hasOffer,
      togglePopup,
      popupState,
      isFetched,
      isMobile,
      scorpioData,
      pageUrl,
      host,
      analytics
    } = this.props;
    const [firstTour, ...otherTours] = tours;

    return (
      <div className="uncategorized-container">
        <div className="select-wrapper" id="select-tickets">
          <div className="select-text">
            {labels[currentLanguage].TOUR_LIST_HEADING}
          </div>
          <div className="divider"></div>
        </div>
        <div className="products-container">
          <Product
            key={0}
            tgid={firstTour.tgid}
            earliestAvailability={firstTour.earliestAvailability}
            tid={firstTour.tour_variant_id}
            title={firstTour.tour_title_override}
            descriptors={firstTour.marketing_highlights_override}
            highlights={firstTour.tour_description_override}
            scorpioData={scorpioData[firstTour.tgid]}
            tourPrices={tourPrices}
            currencySymbol={currencySymbol}
            uid={uid}
            currentLanguage={currentLanguage}
            bookNowText={bookNowText}
            showLessText={showLessText}
            readMoreText={readMoreText}
            productOffer={productOffer}
            hasOffer={hasOffer}
            togglePopup={togglePopup}
            offerId={firstTour.offer__free_tour.id}
            popupState={popupState}
            isMobile={isMobile}
            isFetched={isFetched}
            pageUrl={pageUrl}
            host={host}
            ctaUrlSuffix={firstTour.cta_url_suffix || ""}
            isScratchPriceEnabled={firstTour.show_scratch_price === "Yes"}
            analytics={analytics}
          />

          {this.state.isClient
            ? otherTours.map((tour, index) => (
                <Product
                  key={index}
                  tgid={tour.tgid}
                  earliestAvailability={tour.earliestAvailability}
                  tid={tour.tour_variant_id}
                  title={tour.tour_title_override}
                  descriptors={tour.marketing_highlights_override}
                  highlights={tour.tour_description_override}
                  scorpioData={scorpioData[tour.tgid]}
                  tourPrices={tourPrices}
                  currencySymbol={currencySymbol}
                  uid={uid}
                  currentLanguage={currentLanguage}
                  bookNowText={bookNowText}
                  showLessText={showLessText}
                  readMoreText={readMoreText}
                  productOffer={productOffer}
                  hasOffer={hasOffer}
                  togglePopup={togglePopup}
                  offerId={tour.offer__free_tour.id}
                  popupState={popupState}
                  isMobile={isMobile}
                  isFetched={isFetched}
                  pageUrl={pageUrl}
                  host={host}
                  ctaUrlSuffix={tour.cta_url_suffix || ""}
                  isScratchPriceEnabled={tour.show_scratch_price === "Yes"}
                  analytics={analytics}
                />
              ))
            : null}
        </div>
      </div>
    );
  }
}
