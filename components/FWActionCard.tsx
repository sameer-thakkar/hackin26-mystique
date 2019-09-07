import React, { PureComponent } from "react";
import { RichText } from "prismic-reactjs";
import { shortCodeSerializer } from "../utils/shortCodes";

export default class FWActionCard extends PureComponent<any, any> {
  render() {
    const { title, cards } = this.props;
    return (
      <div>
        <h2 className="heading">{title}</h2>
        <div className="divider-1"></div>
        <div className="products">
          {cards.map((card, index) => (
            <div key={index} className="product">
              <div className="product-left">
                <div className="product-heading">{card.card_heading}</div>

                <RichText
                  key={0}
                  render={card.card_description}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
              <div className="product-right">
                <a href={card.cta_link}>
                  <div className="book-now">{card.cta_title}</div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
