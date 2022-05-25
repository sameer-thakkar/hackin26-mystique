import React from 'react';
import styled from 'styled-components';
import Emoji from 'components/common/Emoji';

export const StyledInfoBanner = styled.div`
  padding: 18px 20px 28px;
  display: grid;
  border-radius: 8px;
  justify-content: left;
  align-items: center;
  background: ${({ colorScheme: cs }) => cs.background};
  * {
    color: ${({ colorScheme: cs }) => cs.color};
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 2px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 12px;
  }

  .offer-emoji {
    font-size: 26px;
    font-weight: 500;
    line-height: 36px;
    letter-spacing: 5px;

    @media (max-width: 768px) {
      font-size: 24px;
      line-height: 33px;
    }
  }
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const InfoBanner = ({ title, description, colorScheme }) => {
  return (
    <StyledInfoBanner colorScheme={colorScheme}>
      <Title>
        <Emoji symbol="🤑" label="money-mouth-face" /> {title}
      </Title>
      <Description>{description}</Description>
    </StyledInfoBanner>
  );
};

export default InfoBanner;
