import styled from 'styled-components';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const ExploreContainer = styled.div`
  margin: 3rem auto;
  max-width: ${SIZES.MAX_WIDTH};
  .explore-title {
    margin-bottom: 3rem;
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  }
  .entity-header {
    ${expandFontToken(FONTS.DISPLAY_SMALL)};
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
    margin: 0 0 1rem 1rem;
    .explore-title {
      margin-bottom: 1.5rem;
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .entity-header {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .entity-image-container {
      max-width: min-content;
    }
  }
`;
