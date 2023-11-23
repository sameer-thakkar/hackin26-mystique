import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledReviewsContainer = styled.div<{ noMargin?: boolean }>`
  max-width: 75rem;
  margin: ${({ noMargin }) => (noMargin ? '2rem auto' : '5rem auto')};

  .swiper {
    margin-top: 2rem;
    max-width: calc(100vw - (5.46vw * 2));
  }

  @media (max-width: 768px) {
    margin: ${({ noMargin }) => (noMargin ? '2rem 0' : '4rem 0')};

    .swiper {
      margin: ${({ noMargin }) =>
        noMargin ? '1.5rem 0 0' : '1.5rem 1.5rem 0 1.5rem'};
    }
  }
`;

export const StyledSectionTitle = styled.h2`
  ${expandFontToken(FONTS.HEADING_LARGE)};
  margin: 0;

  @media (max-width: 768px) {
    max-width: 75%;
    margin: 0 1.5rem;

    ${expandFontToken(FONTS.HEADING_REGULAR)};
  }
`;

export const StyledReviewCardContainer = styled.div`
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.GRAY.G7};
  background: linear-gradient(
    137deg,
    rgba(255, 236, 255, 0.21) 0.88%,
    rgba(226, 216, 255, 0.31) 76.06%
  );
  padding: 1.5rem;

  height: 14.3125rem;

  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;

  grid-column-gap: 0.5rem;

  p {
    margin: 0;
  }

  .name {
    ${expandFontToken(FONTS.HEADING_SMALL)};
  }
  .vehicle-type {
    margin-top: 0.15rem;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G3};

    span {
      margin-right: 0.25rem;
    }
  }

  .stars {
    align-self: center;
    justify-self: flex-end;

    svg {
      width: 1rem;
      :not(:last-child) {
        margin-right: 0.12rem;
      }
    }
  }

  .text {
    margin-top: 0.75rem;
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
    color: ${COLORS.GRAY.G3};

    grid-column: span 3;
  }

  @media (max-width: 768px) {
    padding: 1.2rem 1.31rem;

    height: 15.5625rem;

    .stars svg {
      width: 0.9rem;
      :not(:last-child) {
        margin-right: 0.1rem;
      }
    }
  }
`;
