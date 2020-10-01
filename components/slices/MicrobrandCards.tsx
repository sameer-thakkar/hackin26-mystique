import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Image from 'UI/Image';
import { shortCodeSerializer } from 'utils/shortCodes';
import { tourListApiParser } from 'utils/dataParsers';
import { SOLEIL, COLORS } from 'constants/ui-constants';
import { THEMES } from 'constants/index';
import Conditional from 'components/common/Conditional';
import PriceBlock, { StyledPriceBlock } from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';

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
  grid-template-rows: 170px auto;
  transition: all ease 0.2s;
  align-items: start;
  border-radius: 5px;

  ${StyledPriceBlock} {
    grid-column: 2 / 3;
    align-items: center;
    font-size: 16px;
    line-height: 1.2;
    justify-content: right;
    .tour-scratch-price {
      grid-column: 1 / 2;
    }
  }

  .card-bottom .card-price {
    font-size: 16px;
    font-weight: 500;
  }

  .card-bottom {
    padding: 10px;
    align-items: start;
    display: grid;
    grid-gap: 5px;
  }

  &:hover {
    transform: translate3d(0, -6px, 0);
    -webkit-perspective: 1000;
    -webkit-transform: translate3d(0, -6px, 0);
  }
  .card-image {
    height: 100%;
  }
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
  .card-bottom .card-title {
    font-size: 15px;
    color: #000;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.MEDIUM};
    line-height: 1;
    grid-row: 1;
    grid-column: 1 / 2;
  }

  .card-bottom .card-price {
    font-family: ${SOLEIL.FONT_STACK};
    justify-self: right;
    grid-row: 1;
    grid-column: 2 / 3;
    letter-spacing: 0.5px;
    text-align: right;
    line-height: 1.3;
  }

  ${({ theme }) =>
    theme.theme === THEMES.MIN_BLUE
      ? `
      .card-bottom {
        padding: 0
      }
      .card-image img {
        border-radius: 4px;
      }
      .card-bottom .card-price,
      .card-bottom .card-title,
      .card-bottom .tour-price {
        grid-column: 1 / 3;
        grid-row: unset;
        font-size: 16px;
        line-height: 22px;
      }
      .card-bottom .tour-scratch-price {
        font-size: 12px;
        line-height: 12px;
        color: ${COLORS.GREY_G4};
      }
      .card-bottom .card-price,
      .card-bottom .tour-price {
        justify-self: left;
        color: ${COLORS.GREY_G3};
        font-weight: ${SOLEIL.BOLD};
      }
      .card-bottom .card-title {
        font-weight: ${SOLEIL.SEMIBOLD};
      }
      `
      : `
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
    `}
`;

export const LinkCards = (props) => {
  const {
    cards,
    isFetched,
    currencySymbol,
    cardPrices,
    cardClassName,
    as,
    gridAutoCol,
  } = props;

  const { lang } = useContext(MBContext);

  return (
    <StyledMBCards {...(as !== React.Fragment ? { gridAutoCol } : {})} as={as}>
      {cards.map((card, index) => {
        return (
          <div key={index} className={cardClassName || ''}>
            <a target="_blank" rel="noopener noreferrer" href={card.link}>
              <MicrobrandCard className="microbrand-card">
                <div className="card-image">
                  <Image
                    width={600}
                    height={300}
                    aspectRatio="16:10"
                    url={card.image.url}
                    alt={card.image.alt}
                  />
                </div>
                <div className="card-bottom">
                  <span className="card-title">{card.title}</span>
                  {isFetched && card.tgid && cardPrices[card.tgid] ? (
                    <>
                      <Conditional if={cardPrices[card.tgid].listingPrice}>
                        <PriceBlock
                          lang={lang}
                          price={cardPrices[card.tgid].listingPrice}
                          showScratchPrice={true}
                          prefix={false}
                          currencySymbolOverride={currencySymbol}
                        />
                      </Conditional>
                      <Conditional
                        if={
                          !cardPrices[card.tgid].listingPrice &&
                          cardPrices[card.tgid].price
                        }
                      >
                        <span className="card-price">
                          {currencySymbol}
                          {cardPrices[card.tgid].price}
                        </span>
                      </Conditional>
                    </>
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
  .microbrand-cards-content {
    h2 {
      margin: 24px 0;
    }
  }
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

type MicrobrandCardsProps = {
  cards: any[];
  cardsContent?: any;
};

const MicrobrandCards: React.FC<MicrobrandCardsProps> = (props) => {
  const [state, setState] = useState({
    cardPrices: {},
    currencySymbol: '',
    isFetched: false,
  });
  const { cards, cardsContent } = props;
  const { isFetched, currencySymbol, cardPrices } = state;

  useEffect(() => {
    const tgidsExist = cards.map((card) => card.tgid).filter((tgid) => tgid);
    if (tgidsExist.length) {
      fetch(`/api/tours/v5/tour-group/list?ids[]=${tgidsExist}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) return;
          const cardPrices = tourListApiParser(json);
          const currencySymbol = json.currencies[0]?.localSymbol;
          setState({
            cardPrices: cardPrices,
            currencySymbol: currencySymbol,
            isFetched: true,
          });
        });
    }
  }, [cards, setState]);

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
