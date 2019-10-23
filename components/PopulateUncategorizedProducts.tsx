import React, { Component } from "react";
import Product from "./Product";
import * as labels from "../static/localization/labels";

export default class PopulateUncategorizedProducts extends Component<any, any> {
  render() {
    const {
      uncategorizedTours: tours,
      tourPrices,
      currencySymbol,
      currentDomain,
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
      trackEvent,
      scorpioData,
      pageUrl,
      host
    } = this.props;

    return (
      <div className="uncategorized-container">
        <div className="select-wrapper" id="select-tickets">
          <div className="select-text">
            {labels[currentLanguage].TOUR_LIST_HEADING}
          </div>
          <div className="divider"></div>
        </div>
        <div className="products-container">
          {tours.map((tour, index) => (
            <Product
              key={index}
              tgid={tour.tgid}
              tid={tour.tour_variant_id}
              title={tour.tour_title_override}
              descriptors={tour.marketing_highlights_override}
              highlights={tour.tour_description_override}
              scorpioData={scorpioData[tour.tgid]}
              tourPrices={tourPrices}
              currencySymbol={currencySymbol}
              currentDomain={currentDomain}
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
              trackEvent={trackEvent}
              pageUrl={pageUrl}
              host={host}
              isScratchPriceEnabled={tour.show_scratch_price === "Yes"}
            />
          ))}
        </div>
      </div>
    );
  }
}
