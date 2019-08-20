import React, { Component } from "react";
import Product from "./Product";

export default class PopulateUncategorizedProducts extends Component<any, any> {
  render() {
    const {
      uncategorizedTours: tours,
      uncategorizedToursHeading: heading,
      tourPrices,
      currencySymbol,
      currentDomain,
      currentLanguage,
      bookNowText,
      showLessText,
      readMoreText
    } = this.props;
    return (
      <div className="uncategorized-container">
        <div className="select-wrapper" id="select-tickets">
          <h1 className="select-text">{heading}</h1>
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
              tourPrices={tourPrices}
              currencySymbol={currencySymbol}
              currentDomain={currentDomain}
              currentLanguage={currentLanguage}
              bookNowText={bookNowText}
              showLessText={showLessText}
              readMoreText={readMoreText}
            />
          ))}
        </div>
      </div>
    );
  }
}
