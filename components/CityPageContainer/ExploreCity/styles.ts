import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const ExploreContainer = styled.div`
  margin: 3rem auto;
  max-width: ${SIZES.MAX_WIDTH};
  .explore-title {
    margin-bottom: 2rem;
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  }
  .entity-name {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
    color: ${COLORS.GRAY.G2};
  }

  .entity-image-container {
    position: relative;
    img {
      border-radius: 8px;
      height: 15rem;
      width: 11.25rem;
    }
  }

  .prev-slide {
    top: 7.5rem;
  }
  .next-slide {
    top: 7.5rem;
  }
  &:not(.swiper-initialised) {
    .entity-image-container {
      width: 11.25rem;
    }
  }
  @media (max-width: 768px) {
    padding: 1.875rem 0 1.875rem 1rem;
    margin: 0;
    .explore-title {
      margin: 0 0 1.5rem;
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .entity-image-container {
      max-width: min-content;
      .entity-name {
        padding-top: 0.25rem;
      }
      img {
        height: 13rem;
        width: 9.75rem;
      }
    }
    &:not(.swiper-initialised) {
      .entity-image-container {
        width: 9.75rem;
      }
    }
  }
`;

export const EntityContainer = styled.div`
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.875rem 0 -1rem;
  .entity-header {
    margin: 0;
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    .entity-header {
      margin: 0;
      ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
    }
  }
`;

export const SeeAllWrapper = styled.span`
  display: flex;
  align-items: center;
  color: ${COLORS.GRAY.G2};
  svg {
    margin: 0.1rem 0 0 0.2rem;
  }
  ${expandFontToken(FONTS.UI_LABEL_LARGE)};
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    svg {
      margin: 0.1rem 1rem 0 0.2rem;
      height: 0.75rem;
      width: 0.75rem;
    }
  }
`;
