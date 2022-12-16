import React from 'react';
import styled from 'styled-components';
import { strings } from 'const/strings';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HEADPHONE, HAPPY_EMOJI, VERIFIED, GOLDEN_STAR } from 'assets/SvgIcons';

const FeatureCardWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 40px 0px;
  margin-top: 100px;

  div {
    align-items: center;
    justify-content: center;
    display: grid;
    text-align: center;
    padding: 0 15px;
  }

  .feature-card-heading {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)}
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
  const { FEATURE_CARD } = strings || {};
  return (
    <FeatureCardWrapper>
      <div>
        <div>{HAPPY_EMOJI}</div>
        <div className="feature-card-heading">
          {FEATURE_CARD.HEADING_CUSTOMER}
        </div>
        <p>{FEATURE_CARD.SUB_HEADING_CUSTOMER}</p>
      </div>
      <div>
        <div>{GOLDEN_STAR}</div>
        <div className="feature-card-heading">
          {FEATURE_CARD.HEADING_RATING}
        </div>
        <p>{FEATURE_CARD.SUB_HEADING_RATING}</p>
      </div>
      <div>
        <div>{VERIFIED}</div>
        <div className="feature-card-heading">{FEATURE_CARD.HEADING_SAFE}</div>
        <p>{FEATURE_CARD.SUB_HEADING_SAFE}</p>
      </div>
      <div>
        <div>{HEADPHONE}</div>
        <div className="feature-card-heading">
          {FEATURE_CARD.HEADING_SUPPORT}
        </div>
        <p>{FEATURE_CARD.SUB_HEADING_SUPPORT}</p>
      </div>
    </FeatureCardWrapper>
  );
};

export default FeatureCard;
