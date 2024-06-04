import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';

export const SectionTitle = styled.h2<{
  $showSmaller?: boolean;
}>`
  ${getFontDetailsByLabel(FONTS.HEADING_LARGE)};
  margin: 0;
  color: ${COLORS.GRAY.G1};

  ${({ $showSmaller }) =>
    $showSmaller &&
    css`
      ${getFontDetailsByLabel(FONTS.HEADING_REGULAR)};
      color: ${COLORS.GRAY.G2};
    `};

  @media (min-width: 768px) {
    ${getFontDetailsByLabel(FONTS.DISPLAY_SMALL)};

    ${({ $showSmaller }) =>
      $showSmaller &&
      css`
        ${getFontDetailsByLabel(FONTS.HEADING_LARGE)};
        color: ${COLORS.GRAY.G2};
      `};
  }
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;

  max-width: 75rem;
  margin: 2rem auto 0;

  gap: 1.25rem;

  .flex {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    gap: 1.5rem;
    padding: 0;
    margin-block: 3rem;

    .flex {
      flex-direction: row;

      .all-products {
        flex: 1;
      }
    }
  }
`;

export const ProductCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  max-width: 100%;

  @media (min-width: 769px) {
    gap: 1.5rem;
    min-width: 48rem;
  }
`;

export const AirportProductsSection = styled.div`
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
  .airport-name {
    ${getFontDetailsByLabel(FONTS.HEADING_XS)};
    margin: 0 0 0.75rem 0;
  }

  @media (min-width: 769px) {
    &:not(:last-child) {
      margin-bottom: 2.625rem;
    }
    .airport-name {
      ${getFontDetailsByLabel(FONTS.HEADING_REGULAR)};

      margin: 0 0 1rem 0;
    }
  }
`;
