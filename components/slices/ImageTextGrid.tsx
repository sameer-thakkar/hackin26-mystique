import React from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { SOLEIL } from 'const/ui-constants';

import Image from '../UI/Image';
import { shortCodeSerializer } from '../../utils/shortCodes';

type ImageTextProps = {
  cols: number;
  cards: any[];
};

const StyledWrapper = styled.div`
  display: grid;
  grid-gap: 1.5em;
  grid-template-columns: repeat(${(props) => props.colsProps}, 1fr);
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledComboCard = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-gap: 10px;
  padding: 20px;
  padding-top: 14px;
  border-radius: 3px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.18);
  img {
    width: 100%;
  }
  h2.title {
    font-size: 18px;
    line-height: 1.4;
    color: #666666;
    text-align: justify;
    font-weight: 500;
    font-family: ${SOLEIL.FONT_STACK};
    margin: unset;
    ::after {
      content: unset !important;
    }
  }
  div {
    font-family: ${SOLEIL.FONT_STACK};
    p {
      margin: unset !important;
    }
  }
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

/**
 *
 * Image Text Combo Card Grid
 *
 * ### Non-repeatable zone
 * - Number of Columns
 *  - The no. of cards that appear in each row
 *
 * ### Repeatable zone
 * - Image Source
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Image URL
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Card Title
 * - Card Description
 *  - Rich Text field
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 */

const ImageTextGrid: React.FC<ImageTextProps> = ({ cards, cols }) => (
  <StyledWrapper colsProps={cols}>
    {cards.map((card, index) => (
      <StyledComboCard key={index}>
        <h2 className="title">{card.card_title}</h2>
        <Image
          width={580}
          height={300}
          format="pjpg"
          url={card.image_url.url || card.image_source.url}
          attribution={card.image_source?.copyright}
          alt={card.image_alt || card.image_source.alt}
        />
        <div>
          <RichText
            render={card.card_description}
            htmlSerializer={shortCodeSerializer}
          />
        </div>
      </StyledComboCard>
    ))}
  </StyledWrapper>
);

export default ImageTextGrid;
