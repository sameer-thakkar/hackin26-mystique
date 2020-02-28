import React from 'react';
import styled from 'styled-components';
import sliceHandler from '../Slices';

const StyledCardSection = styled.div`
  display: ${props => {
    if (props.sectionType.toLowerCase() === 'grid') {
      return `grid`;
    }
    return `grid`;
  }};
  grid-template-columns: ${props => {
    if (props.cardType === 'secondary') {
      return `50% 50%`;
    } else if (props.cardType === 'mobile') {
      return `repeat(${props.noOfCards}, ${100 / props.noOfCards}%)`;
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

const CardSection: React.FC<CardSectionProps> = ({
  slices,
  cardType,
  sectionType,
  title,
}) => {
  let finalCardType = cardType;
  if (slices.length === 1) finalCardType = 'primary';

  return (
    <>
      {title ? <h2>{title}</h2> : null}
      <StyledCardSection
        cardType={finalCardType}
        sectionType={sectionType}
        noOfCards={slices.length}
      >
        {slices.map((slice, index) => {
          return sliceHandler(slice, { cardType: finalCardType, index });
        })}
      </StyledCardSection>
    </>
  );
};

export default CardSection;
