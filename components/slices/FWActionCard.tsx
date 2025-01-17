import React from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import Button from 'UI/Button';
import { generateSidenavId } from 'utils/helper';
import { shortCodeSerializerWithParentProps } from 'utils/shortCodes';
import { SLICE_TYPES } from 'const/index';
import { HALYARD } from 'const/ui-constants';

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
  &:first-of-type {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
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
  font-family: ${HALYARD.FONT_STACK};
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

const FWActionCard: React.FC<React.PropsWithChildren<FWActionCardProps>> = ({
  title,
  cards,
}) => {
  return (
    <>
      <h2 id={generateSidenavId(title)}>{title}</h2>
      {cards.map((card, index) => (
        <StyledProductCard key={index}>
          <StyledProductCardLeft>
            <StyledProductCardHeading>
              {card.card_heading}
            </StyledProductCardHeading>
            <PrismicRichText
              key={0}
              field={card.card_description}
              components={(...defaultArgs: any) =>
                shortCodeSerializerWithParentProps(defaultArgs, {
                  sectionName: title,
                  sliceType: SLICE_TYPES.FULL_WIDTH_ACTION_CARD,
                })
              }
            />
          </StyledProductCardLeft>
          <StyledProductCardRight>
            <a href={card.cta_link} target="_blank" rel="noopener">
              <Button>{card.cta_title}</Button>
            </a>
          </StyledProductCardRight>
        </StyledProductCard>
      ))}
    </>
  );
};

export default FWActionCard;
