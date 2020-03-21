import React, { useState, useEffect } from 'react';
import Image from '../UI/Image';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';
import { tourListApiParser } from '../../utils/DataParsers';

type MicrobrandCardsProps = {
  cards: any[];
  cardsContent: any;
  lazyLoadImages?: boolean;
};

/**
 * A card grid for microbrands
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - Content Above Cards
 *  - Rich Text field
 * - Content Below Cards
 *  - Rich Text field
 *
 * ### Repeatable zone
 * - Image Source
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Image URL
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 * - Microbrand Link
 * - TGID
 * - Card Title
 */

const MicrobrandCards: React.FC<MicrobrandCardsProps> = props => {
  const [state, setState] = useState({
    cardPrices: {},
    currencySymbol: '',
    isFetched: false,
  });

  const { cards, lazyLoadImages, cardsContent } = props;
  const { isFetched, currencySymbol, cardPrices } = state;

  useEffect(() => {
    const tgidsExist = cards.map(card => card.tgid).filter(tgid => tgid);
    if (tgidsExist.length) {
      fetch(
        `https://api.headout.com/api/v5/tour-group/list?ids[]=${tgidsExist}`
      )
        .then(res => res.json())
        .then(json => {
          const cardPrices = tourListApiParser(json);
          const currencySymbol = json.currencies[0].localSymbol;
          setState({
            cardPrices: cardPrices,
            currencySymbol: currencySymbol,
            isFetched: true,
          });
        });
    }
  }, []);

  return (
    <div className="microbrands-list">
      <div className="microbrand-cards-content">
        <RichText
          render={cardsContent.content_above_cards}
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
                      dontLazyLoad={!lazyLoadImages}
                      url={card.image_url.url || card.image_source.url}
                      alt={card.image_alt || card.image_source.alt}
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
                      ''
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
          render={cardsContent.content_below_cards}
          htmlSerializer={shortCodeSerializer}
        />
      </div>
    </div>
  );
};

export default MicrobrandCards;
