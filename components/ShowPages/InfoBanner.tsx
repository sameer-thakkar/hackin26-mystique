import React from 'react';
import styled from 'styled-components';
import Emoji from 'components/common/Emoji';
import { expandFontToken } from 'const/typography';
import { FONTS } from 'const/fonts';

export const StyledInfoBanner = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
  display: grid;
  border-radius: 0.5rem;
  justify-content: left;
  align-items: center;
  background: ${({ colorScheme: cs }) => cs.background};
  * {
    color: ${({ colorScheme: cs }) => cs.color};
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.div`
  ${expandFontToken(FONTS.SUBHEADING_LARGE)}
  margin-bottom: ${({ applyCustomMarginForHeading }) =>
    applyCustomMarginForHeading};

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    margin-bottom: 0.75rem;
  }

  .emoji {
    font-size: 1.625rem;
    line-height: 2.24rem;
    margin-right: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.125rem;
      line-height: 1.5rem;
    }
  }
`;

const Description = styled.div`
  ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)}
  }
`;

const InfoBanner = ({
  title,
  description,
  colorScheme,
  emojiSymbol = '🤑',
  emojiLabel = 'money-mouth-face',
  applyCustomMarginForHeading = '0.5rem',
}) => {
  return (
    <StyledInfoBanner colorScheme={colorScheme}>
      <Title applyCustomMarginForHeading={applyCustomMarginForHeading}>
        <Emoji symbol={emojiSymbol} label={emojiLabel} /> {title}
      </Title>
      <Description>{description}</Description>
    </StyledInfoBanner>
  );
};

export default InfoBanner;
