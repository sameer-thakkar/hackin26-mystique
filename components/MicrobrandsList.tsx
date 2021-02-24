import React from 'react';
import styled from 'styled-components';
import { SOLEIL } from 'const/ui-constants';

import MicrobrandCards from './slices/MicrobrandCards';

const StyledMBList = styled.div`
  max-width: 1200px;
  margin: auto;

  .microbrands-list-heading {
    border-left: 3px solid #669dde;
    padding: 5px 10px 5px;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
    color: #000000;
    margin: 40px 0px;
    font-size: 2em;
  }
  @media (max-width: 768px) {
    margin: auto 25px;
    .microbrands-list-heading {
      font-size: 24px;
    }
  }
`;

const MicrobrandList = (props) => {
  const { microbrandCards, microbrandCardsHeading } = props;
  return (
    <StyledMBList className="microbrands-list">
      {microbrandCardsHeading && (
        <div className="microbrands-list-heading">{microbrandCardsHeading}</div>
      )}
      {microbrandCards.length ? <br /> : null}
      <MicrobrandCards
        cards={microbrandCards.filter((card) => card?.microbrand_link?.url)}
        cardsContent={{}}
      />
    </StyledMBList>
  );
};

export default MicrobrandList;
