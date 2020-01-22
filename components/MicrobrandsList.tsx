import React, { Component } from "react";
import Image from "./Image";

export default class MicrobrandList extends Component<any, any> {
  state = {
    cardPrices: {},
    currencySymbol: "",
    isFetched: false
  };

  async componentDidMount() {
    const { microbrandCards } = this.props;
    const tgids = microbrandCards.map(card => card.tgid);
    const tgidsExist = tgids.filter(tgid => tgid);
    if (tgidsExist.length) {
      const fetchPrice = await fetch(
        `https://api.headout.com/api/v5/tour-group/list?ids[]=${tgidsExist}`
      ).then(res => res.json());
      const cardPrices = fetchPrice.tourGroups.reduce(
        (accum, response) => ({
          ...accum,
          [response.id]: {
            price: response.listingPrice ? response.listingPrice.finalPrice : ""
          }
        }),
        {}
      );
      const currencySymbol = fetchPrice.currencies[0].localSymbol;
      this.setState({
        cardPrices: cardPrices,
        currencySymbol: currencySymbol,
        isFetched: true
      });
    }
  }

  render() {
    const { microbrandCards, microbrandCardsHeading } = this.props;
    const { isFetched, currencySymbol, cardPrices } = this.state;
    return (
      <div className="microbrands-list">
        {microbrandCardsHeading && (
          <div className="microbrands-list-heading">
            <h1>{microbrandCardsHeading}</h1>
          </div>
        )}
        {microbrandCards.length ? <br /> : null}
        <div className="microbrand-cards">
          {microbrandCards.map((card, index) => {
            return (
              <div key={index} className="microbrand-card-wrapper">
                <a target="_blank" href={card.microbrand_link.url}>
                  <div className="microbrand-card">
                    <div className="card-image">
                      <Image
                        format="pjpg"
                        width={600}
                        height={300}
                        url={card.image_source.url || card.image_url.url}
                      />
                    </div>
                    <div className="card-bottom">
                      <span className="card-title">{card.card_title}</span>
                      {isFetched && card.tgid ? (
                        <span className="card-price">
                          {currencySymbol}
                          {cardPrices[card.tgid].price}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
