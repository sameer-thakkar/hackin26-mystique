import React from 'react';
import styled from 'styled-components';
import { strings } from 'const/strings';

import {
  HEADPHONE,
  HAPPY_EMOJI,
  VERIFIED,
  GOLDEN_STAR,
} from '../../assets/SvgIcons';

const FeatureCardWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 40px 0px;

  div {
    align-items: center;
    justify-content: center;
    display: grid;
    text-align: center;
    padding: 0 15px;
  }

  h3 {
    font-size: 16px;
    margin: 20px 0 8px 0;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: auto;
    div {
      margin: 10px;
    }
  }
`;

const FeatureCard = () => {
  return (
    <FeatureCardWrapper>
      <div>
        <div>{HAPPY_EMOJI}</div>
        <h3>{strings.FEATURE_CARD_SHOW_PAGES.HEADING_CUSTOMER}</h3>
        <p>{strings.FEATURE_CARD_SHOW_PAGES.SUB_HEADING_CUSTOMER}</p>
      </div>
      <div>
        <div>{GOLDEN_STAR}</div>
        <h3>{strings.FEATURE_CARD_SHOW_PAGES.HEADING_RATING}</h3>
        <p>{strings.FEATURE_CARD_SHOW_PAGES.SUB_HEADING_RATING}</p>
      </div>
      <div>
        <div>{VERIFIED}</div>
        <h3>{strings.FEATURE_CARD_SHOW_PAGES.HEADING_SAFE}</h3>
        <p>{strings.FEATURE_CARD_SHOW_PAGES.SUB_HEADING_SAFE}</p>
      </div>
      <div>
        <div>{HEADPHONE}</div>
        <h3>{strings.FEATURE_CARD_SHOW_PAGES.HEADING_SUPPORT}</h3>
        <p>{strings.FEATURE_CARD_SHOW_PAGES.SUB_HEADING_SUPPORT}</p>
      </div>
    </FeatureCardWrapper>
  );
};

export default FeatureCard;
