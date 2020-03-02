import React from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';
import useWindowSize from '../hooks/useWindowSize';

const StyledCardSection = styled.div`
  display: ${props => {
    if (props.sectionType.toLowerCase() === 'grid') {
      return `grid`;
    }
    return `grid`;
  }};
  grid-template-columns: ${props => {
    if (props.cardType === 'column') {
      return `50% 50%`;
    } else if (props.cardType === 'mobile' && !props.isMobile) {
      return `repeat(${props.noOfCards}, calc(${100 /
        props.noOfCards}% - ${((props.noOfCards - 1) * 20) /
        props.noOfCards}px))`;
    }
    return `100%`;
  }};
  grid-gap: 20px;
`;

type CardSectionProps = {
  slices: any[];
  cardType: string;
  sectionType: string;
  title?: string;
};

/**
 * A card section displaying different types of Cards in a gird.
 *
 * This is a special kind of slice. To use follow below instructions:
 *
 * You have to first insert a 'Card Section Start' slice with the following fields:
 *
 * ### Non-repeatable zone
 * - Card Section Title
 * - Card Section Type
 * - Card Type
 *
 * ### Repeatable zone
 * Nil.
 *
 * After this, keep adding intermediate Card slices to your needs and then close the Section with a 'Card Section End' slice.
 */

const CardSection: React.FC<CardSectionProps> = ({
  slices,
  cardType,
  sectionType,
  title,
}) => {
  let finalCardType = cardType;
  if (slices.length === 1) finalCardType = 'desktop';

  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = React.useState(false);

  let cards = slices.map((slice, index) => {
    return sliceHandler(slice, { cardType: finalCardType, index });
  });

  cards.pop();

  React.useEffect(() => {
    setIsMobile(width <= 760);
  }, [width, setIsMobile]);

  return (
    <>
      {title ? <h2>{title}</h2> : null}
      <StyledCardSection
        cardType={finalCardType}
        sectionType={sectionType}
        noOfCards={cards.length}
        isMobile={isMobile}
      >
        {cards}
      </StyledCardSection>
    </>
  );
};

export default CardSection;
