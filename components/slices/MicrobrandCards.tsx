import React, { useState, useEffect } from 'react';
import Image from '../UI/Image';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';
import { tourListApiParser } from '../../utils/DataParsers';
import styled from 'styled-components';

type MicrobrandCardsProps = {
  cards: any[];
  cardsContent: any;
  lazyLoadImages?: boolean;
};

const StyledMBCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  ${({ gridAutoCol }) =>
    gridAutoCol
      ? `
    grid-template-columns: unset;
    grid-auto-flow: column;
  `
      : ''}
  grid-gap: 20px;
  .card-image img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    border-radius: 5px;
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  a {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .microbrands-list {
      margin: auto 25px;
    }
  }
`;

const MicrobrandCard = styled.div`
  color: #444444;
  display: grid;
  grid-template-rows: 170px auto 1fr;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  transition: all ease 0.2s;
  border-radius: 5px;

  .card-bottom .card-title {
    font-size: 15px;
    color: #000;
    font-family: 'Avenir', 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial,
      sans-serif;
    font-weight: 500;
    line-height: 1;
    grid-row: 1;
    grid-column: 1 / 2;
  }

  .card-bottom .card-price {
    font-family: 'Avenir', 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial,
      sans-serif;
    font-size: 10px;
    justify-self: right;
    grid-row: 1;
    grid-column: 2 / 3;
    letter-spacing: 0.5px;
    text-align: right;
    line-height: 1.3;
  }

  .card-bottom .card-price {
    font-size: 16px;
    font-weight: 500;
  }

  .card-bottom {
    padding: 10px;
    align-items: center;
    display: grid;
    grid-gap: 5px;
  }

  &:hover {
    transform: translate3d(0, -6px, 0);
    -webkit-perspective: 1000;
    -webkit-transform: translate3d(0, -6px, 0);
  }
`;

export const LinkCards = (props) => {
  const {
    cards,
    isFetched,
    currencySymbol,
    lazyLoadImages,
    cardPrices,
    cardClassName,
    as,
    gridAutoCol,
  } = props;
  return (
    <StyledMBCards gridAutoCol={gridAutoCol} as={as}>
      {cards.map((card, index) => {
        return (
          <div key={index} className={cardClassName || ''}>
            <a target="_blank" rel="noopener noreferrer" href={card.link}>
              <MicrobrandCard div className="microbrand-card">
                <div className="card-image">
                  <Image
                    format="pjpg"
                    width={600}
                    height={300}
                    aspectRatio="16:10"
                    dontLazyLoad={!lazyLoadImages}
                    url={card.image.url}
                    alt={card.image.alt}
                  />
                </div>
                <div className="card-bottom">
                  <span className="card-title">{card.title}</span>
                  {isFetched && card.tgid ? (
                    <span className="card-price">
                      {currencySymbol}
                      {cardPrices[card.tgid].price}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
              </MicrobrandCard>
            </a>
          </div>
        );
      })}
    </StyledMBCards>
  );
};

const StyledMicrobandCards = styled.div`
  max-width: 1200px;
  margin: auto;
  @media (max-width: 768px) {
    margin: auto 25px;
  }
`;

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
const MicrobrandCards: React.FC<MicrobrandCardsProps> = (props) => {
  const [state, setState] = useState({
    cardPrices: {},
    currencySymbol: '',
    isFetched: false,
  });

  const { cards, lazyLoadImages, cardsContent } = props;
  const { isFetched, currencySymbol, cardPrices } = state;

  useEffect(() => {
    const tgidsExist = cards.map((card) => card.tgid).filter((tgid) => tgid);
    if (tgidsExist.length) {
      fetch(
        `https://api.headout.com/api/v5/tour-group/list?ids[]=${tgidsExist}`
      )
        .then((res) => res.json())
        .then((json) => {
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
  const finalCards = cards.map((card) => {
    return {
      image: {
        url: card.image_url.url || card.image_source.url,
        alt: card.image_alt || card.image_source.alt,
      },
      title: card.card_title,
      tgid: card.tgid,
      link: card.microbrand_link.url,
    };
  });
  return (
    <StyledMicrobandCards>
      <div className="microbrand-cards-content">
        <RichText
          render={cardsContent.content_above_cards}
          htmlSerializer={shortCodeSerializer}
        />
      </div>
      <LinkCards
        lazyLoadImages={lazyLoadImages}
        isFetched={isFetched}
        cards={finalCards}
        cardPrices={cardPrices}
        currencySymbol={currencySymbol}
      />
      <div className="microbrand-cards-content">
        <RichText
          render={cardsContent.content_below_cards}
          htmlSerializer={shortCodeSerializer}
        />
      </div>
    </StyledMicrobandCards>
  );
};

export default MicrobrandCards;
