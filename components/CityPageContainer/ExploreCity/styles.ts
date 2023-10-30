import styled from 'styled-components';
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
  .entity-header {
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
    margin-bottom: -1rem;
  }
  .entity-name {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
  }

  .entity-image-container {
    position: relative;
    img {
      border-radius: 8px;
    }
  }

  .prev-slide {
    top: 7.5rem;
  }
  .next-slide {
    top: 7.5rem;
  }
  :not(.swiper-initialised) {
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
    .entity-header {
      ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
      margin-bottom: 1rem;
    }
    .entity-image-container {
      max-width: min-content;
      .entity-name {
        padding-top: 0.25rem;
      }
    }
    :not(.swiper-initialised) {
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
