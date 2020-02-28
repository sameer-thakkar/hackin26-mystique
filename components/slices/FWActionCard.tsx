import React from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';
import Button from '../UI/Button';

type FWActionCardProps = {
  title: string;
  cards: any[];
};

const StyledProductCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #ebebeb;
  border-radius: 5px;
  margin: 30px 0px;
  padding: 15px;
  color: #545454;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledProductCardLeft = styled.div`
  width: 80%;
  p {
    margin: 15px 0px 0px !important;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledProductCardHeading = styled.div`
  font-family: Graphik;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: #545454;
  margin: 0;
`;

const StyledProductCardRight = styled.div`
  width: 20%;
  margin: 15px 0px;
  text-align: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

/**
 *
 * A full width action card with a 'Call to Action' button.
 *
 * ### Non-repeatable zone
 * - Title (title of the section)
 *
 * ### Repeatable zone
 * - Card Heading
 * - Card Description
 *  - Rich Text field
 * - CTA Title
 * - CTA Link
 */

const FWActionCard: React.FC<FWActionCardProps> = ({ title, cards }) => {
  console.log(cards);
  return (
    <>
      <h2>{title}</h2>
      {cards.map((card, index) => (
        <StyledProductCard key={index}>
          <StyledProductCardLeft>
            <StyledProductCardHeading>
              {card.card_heading}
            </StyledProductCardHeading>
            <RichText
              key={0}
              render={card.card_description}
              htmlSerializer={shortCodeSerializer}
            />
          </StyledProductCardLeft>
          <StyledProductCardRight>
            <a href={card.cta_link} target="_blank">
              <Button>{card.cta_title}</Button>
            </a>
          </StyledProductCardRight>
        </StyledProductCard>
      ))}
    </>
  );
};

export default FWActionCard;
