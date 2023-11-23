import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const DateWrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 3.75rem;
  height: 3.75rem;
  box-shadow: none;
  cursor: pointer;

  .date-label {
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    margin-top: 0.813rem;
    margin-bottom: 0.2rem;
    display: flex;
    justify-content: center;
    color: ${COLORS.GRAY.G2};
  }

  &.empty {
    pointer-events: none;
    outline: none;
    border: none;
    cursor: auto;
  }

  &.unavailable {
    pointer-events: none;
    cursor: auto;

    .date-label {
      color: ${COLORS.GRAY.G4A};
    }
  }

  &.min-price .price {
    color: ${COLORS.OKAY_GREEN.DARK_TONE};
    background: #dbfddb;
    border-radius: 2px;
    padding: 1px;
  }

  &.selected-date {
    border-radius: 0.4rem;
    background-color: ${COLORS.PURPS.LIGHT_TONE_4};

    .date-label,
    .price {
      color: ${COLORS.BRAND.PURPS};
    }
  }

  @media (min-width: 768px) {
    &:hover {
      border-radius: 0.4rem;
      background-color: ${COLORS.PURPS.LIGHT_TONE_4};

      .date-label,
      .price {
        color: ${COLORS.BRAND.PURPS};
      }

      &.min-price .price {
        color: ${COLORS.BRAND.PURPS};
        background: ${COLORS.BRAND.WHITE};
      }
    }
  }

  @media (max-width: 768px) {
    width: 3rem;
    height: 3.625rem;

    .date-label {
      margin-top: 0.75rem;
    }
  }
`;

export const PriceWrapper = styled.div`
  ${expandFontToken(FONTS.MISC_TAG_REGULAR)}
  width: 100%;
  margin-bottom: 0.813rem;

  .price {
    color: ${COLORS.GRAY.G4};
  }
`;
