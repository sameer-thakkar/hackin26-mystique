import React, { PureComponent } from "react";

export default class InternalContentCard extends PureComponent<any, any> {
  render() {
    const { title, cards } = this.props;
    return (
      <React.Fragment>
        <h2 className="heading">{title}</h2>
        <div className="divider-1"></div>

        <div className="more-reads-section">
          {cards.map((card, index) => {
            return (
              <a key={index} href={card.card_cta.url}>
                <div className="more-reads">
                  <div className="more-reads-image">
                    <img
                      src="http://www.parkguelltickets.org/wp-content/uploads/2018/05/Park-Guell-Entrance.jpg"
                      alt="image"
                    />
                  </div>
                  <div className="more-reads-text">
                    <span className="more-reads-text-heading">
                      {card.heading}
                    </span>
                    <span className="more-reads-text-text">{card.subtext}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}
