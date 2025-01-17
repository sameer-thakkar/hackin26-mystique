import React from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import Image from 'UI/Image';
import { generateSidenavId } from 'utils/helper';
import COLORS from 'const/colors';
import { SLICE_TYPES } from 'const/index';
import { expandFontToken } from 'const/typography';
import { shortCodeSerializerWithParentProps } from '../../utils/shortCodes';

type ImageTextProps = {
  cols: number;
  cards: any[];
};

const StyledWrapper = styled.div`
  display: grid;
  grid-gap: 1.5em;
  grid-template-columns: repeat(${(props) => (props as any).colsProps}, 1fr);
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledComboCard = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-gap: 10px;
  padding: 16px 24px;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  img {
    width: 100%;
  }
  h2.title {
    text-align: justify;
    color: ${COLORS.GRAY.G3};
    ${expandFontToken('Heading/Regular')}
    margin: unset;
    &::after {
      content: unset !important;
    }
  }
  div {
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

const ImageTextGrid: React.FC<React.PropsWithChildren<ImageTextProps>> = ({
  cards,
  cols,
}) => (
  // @ts-expect-error TS(2769): No overload matches this call.
  <StyledWrapper colsProps={cols}>
    {cards.map((card, index) => (
      <StyledComboCard key={index}>
        <h2 className="title" id={generateSidenavId(card.card_title)}>
          {card.card_title}
        </h2>
        <Image
          width={580}
          height={300}
          format="pjpg"
          url={card.image_url.url || card.image_source.url}
          attribution={card.image_source?.copyright}
          alt={card.image_alt || card.image_source.alt}
          loadHigherQualityImage={true}
        />
        <div>
          <PrismicRichText
            field={card.card_description}
            components={(...defaultArgs: any) =>
              shortCodeSerializerWithParentProps(defaultArgs, {
                sectionName: card?.card_title,
                sliceType: SLICE_TYPES.IMAGE_TEXT_COMBO_GRID,
              })
            }
          />
        </div>
      </StyledComboCard>
    ))}
  </StyledWrapper>
);

export default ImageTextGrid;
