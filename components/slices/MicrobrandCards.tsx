import React, { useState, useEffect } from "react";
import Image from "../Image";
import { RichText } from "prismic-reactjs";
import { shortCodeSerializer } from "../../utils/shortCodes";

interface MicrobrandCardsProps {
  cards: any[];
  cardsContent: any;
}

const MicrobrandCards: React.FC<MicrobrandCardsProps> = props => {
  const [state, setState] = useState({
    cardPrices: {},
    currencySymbol: "",
    isFetched: false
  });

  useEffect(() => {
    const { cards } = props;
    const tgidsExist = cards.map(card => card.tgid).filter(tgid => tgid);
    if (tgidsExist.length) {
      fetch(
        `https://api.headout.com/api/v5/tour-group/list?ids[]=${tgidsExist}`
      )
        .then(res => res.json())
        .then(json => {
          const cardPrices = json.tourGroups.reduce(
            (accum: {}, response) => ({
              ...accum,
              [response.id]: {
                price: response.listingPrice
                  ? response.listingPrice.finalPrice
                  : ""
              }
            }),
            {}
          );
          const currencySymbol = json.currencies[0].localSymbol;
          setState({
            cardPrices: cardPrices,
            currencySymbol: currencySymbol,
            isFetched: true
          });
        });
    }
  }, []);

  const { cards } = props;
  const { isFetched, currencySymbol, cardPrices } = state;

  return (
    <div className="microbrands-list">
      <div className="microbrand-cards-content">
        <RichText
          render={props.cardsContent.content_above_cards}
          htmlSerializer={shortCodeSerializer}
        />
      </div>
      <div className="microbrand-cards">
        {cards.map((card, index) => {
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
      <div className="microbrand-cards-content">
        <RichText
          render={props.cardsContent.content_below_cards}
          htmlSerializer={shortCodeSerializer}
        />
      </div>
    </div>
  );
};

export default MicrobrandCards;
