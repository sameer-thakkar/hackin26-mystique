import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const PopularCategoriesContainer = styled.div`
  margin: 3rem auto 0;
  padding-bottom: 1.5rem;
  max-width: ${SIZES.MAX_WIDTH};
  .popular-categories-title {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  }

  .entity-name {
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    padding-right: 0.4rem;
    color: ${COLORS.BRAND.WHITE};
    position: absolute;
    bottom: 15px;
    left: 15px;
  }
  .entity-image-container {
    position: relative;
    border-radius: 10px;
    cursor: pointer;
    background: linear-gradient(
      184.23deg,
      rgba(0, 0, 0, 0) 66.76%,
      #000000 92.25%
    );
    img {
      z-index: -1;
      position: relative;
      border-radius: 10px;
      height: 22rem;
      width: 14.313rem;
    }
  }
  .prev-slide {
    top: 11.5rem;
  }
  .next-slide {
    top: 11.5rem;
  }

  @media (max-width: 768px) {
    margin: 1.875rem 0 1.875rem 1rem;
    padding: 0;
    .popular-categories-title {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .entity-name {
      color: ${COLORS.BLACK};
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
      position: inherit;
      padding: 0.25rem 0.5rem 0 0;
    }
    .entity-image-container {
      max-width: min-content;
      background: none;
      border-radius: 8px;
      img {
        border-radius: 8px;
        height: 13rem;
        width: 9.75rem;
      }
    }
  }
`;
