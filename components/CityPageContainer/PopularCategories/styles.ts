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
    background: linear-gradient(
      184.23deg,
      rgba(0, 0, 0, 0) 66.76%,
      #000000 92.25%
    );
    img {
      z-index: -1;
      position: relative;
      border-radius: 10px;
    }
  }
  .prev-slide {
    top: 11.5rem;
  }
  .next-slide {
    top: 11.5rem;
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0 1.5rem 1rem;
    .popular-categories-title {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .entity-name {
      color: ${COLORS.BLACK};
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
      position: inherit;
      padding-right: 0.5rem;
    }
    .entity-image-container {
      max-width: min-content;
      background: none;
      border-radius: 8px;
      img {
        border-radius: 8px;
      }
    }
  }
`;
