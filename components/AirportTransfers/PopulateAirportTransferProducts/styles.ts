import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledContainer = styled.div`
  max-width: 75rem;
  margin: 1.25rem auto 2.5rem;

  .shared-transfer-products {
    margin-bottom: 4rem;
  }

  #products-container > div:first-child {
    margin-top: 1.5rem;
  }

  @media (max-width: 768px) {
    .shared-transfer-products {
      margin: 1.25rem 0 2rem;

      #products-container > div:first-child {
        margin-top: 1.25rem;
        margin-bottom: 0;
      }
    }
  }
`;

export const StyledSectionTitle = styled.h3`
  ${expandFontToken(FONTS.HEADING_REGULAR)};
  margin: 0;

  @media (max-width: 768px) {
    max-width: 69%;
    margin: 0 1.5rem;

    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
  }
`;

export const StyledSectionInfo = styled.p`
  margin: 0.5rem auto;
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};

  @media (max-width: 768px) {
    margin: 0.5rem 1.5rem 0;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  }
`;

export const StyledProductCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;

  @media (max-width: 768px) {
    margin: 1.25rem 1.5rem 0;
  }
`;
