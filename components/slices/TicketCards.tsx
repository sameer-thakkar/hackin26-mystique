import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../UI/Button';
import { CURRENCY_SYMBOL_MAP } from '../../constants';
import { COLORS, GRAPHIK } from '../../constants/ui-constants';

const StyledTicketCardsWrapper = styled.div`
  font-family: ${GRAPHIK.FONT_STACK};
  display: grid;
  grid-gap: 24px;
  ${props => {
    if (props.twoColumns) {
      return `grid-template-columns: 1fr 1fr;`;
    }
  }}
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledTicketCard = styled.div`
  display: grid;
  grid-template-columns: auto max-content max-content;
  grid-template-areas: 'heading price cta';
  grid-gap: 16px;
  align-items: center;
  border: 1px solid ${COLORS.CHALK};
  padding: 16px;
  color: ${COLORS.DAVY_GREY};
  @media (max-width: 768px) {
    grid-template-areas: 'heading heading' 'price cta';
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledTicketCardHeading = styled.div`
  grid-area: heading;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: #545454;
  margin: 0;
`;

const StyledTicketCardPrice = styled.div`
  grid-area: price;
  justify-self: flex-end;
  font-size: 20px;
  line-height: 24px;
  font-weight: ${GRAPHIK.HEAVY};
  div {
    display: flex;
    justify-content: flex-end;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #939393;
    text-decoration: line-through;
  }
  @media (max-width: 768px) {
    justify-self: flex-start;
    div {
      justify-content: flex-start;
    }
  }
`;

const StyledTicketCardCTA = styled.div`
  grid-area: cta;
  @media (max-width: 768px) {
    justify-self: flex-end;
  }
`;

type TicketCardsProps = {
  title: string;
  cards: any[];
  twoColumns?: boolean;
};

/**
 *
 * A list of ticket cards with a heading, price and CTA.
 *
 * ### Non-repeatable zone
 * - Title (title of the section)
 *
 * ### Repeatable zone
 * - Card Heading
 * - Tour Group ID
 *  - This is an optional field and will automatically add in the price and heading (if heading is left blank)
 * - CTA Title (Defaults to 'Book Now')
 * - CTA Link
 *
 */

const TicketCards: React.FC<TicketCardsProps> = ({
  title,
  cards,
  twoColumns = false,
}) => {
  const [data, setData] = useState(cards);

  useEffect(() => {
    const tours = cards.reduce((acc, card) => {
      if (card.tgid) return [...acc, card.tgid];
      else return [...acc];
    }, []);
    fetch(
      `https://api.headout.com/api/v6/tour-group/list?ids[]=${tours.join(',')}`
    )
      .then(res => res.json())
      .then(payload => {
        let finalCards = cards.reduce((acc, card) => {
          let temp = null;
          payload.tourGroups.forEach(tour => {
            if (tour.id === Number(card.tgid)) {
              temp = {
                name: tour.name,
                listingPrice: tour.listingPrice,
              };
            }
          });
          if (temp) return [...acc, { ...card, ...temp }];
          return [...acc, card];
        }, []);
        setData(finalCards);
      });
  }, []);

  return (
    <>
      <h2>{title}</h2>
      <StyledTicketCardsWrapper twoColumns={twoColumns}>
        {data.map((card, index) => (
          <StyledTicketCard key={index}>
            <StyledTicketCardHeading>
              {card.card_heading || card.name}
            </StyledTicketCardHeading>
            {card.listingPrice ? (
              <StyledTicketCardPrice>
                <div>
                  {CURRENCY_SYMBOL_MAP[card.listingPrice.currencyCode]}
                  {card.listingPrice.originalPrice}
                </div>
                {CURRENCY_SYMBOL_MAP[card.listingPrice.currencyCode]}
                {card.listingPrice.finalPrice}
              </StyledTicketCardPrice>
            ) : null}
            <StyledTicketCardCTA>
              <a href={card.cta_link.url} target={card.cta_link.target}>
                <Button>{card.cta_title || 'Book Now'}</Button>
              </a>
            </StyledTicketCardCTA>
          </StyledTicketCard>
        ))}
      </StyledTicketCardsWrapper>
    </>
  );
};

export default TicketCards;
