import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const ProductCardContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;

  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 1rem;

  .card-images-carousel {
    width: 100%;
    height: 12.4375rem;
    aspect-ratio: 16 / 10;

    .card-img {
      border-radius: 0;
    }

    img {
      object-fit: cover;
    }

    div,
    img {
      border-radius: 0.75rem;
    }
  }

  .next-available-text {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    margin-top: 0;

    .available-text {
      color: ${COLORS.TEXT.BEACH};
    }
  }

  .tour-tags {
    margin-block: 0.5rem;
  }

  .swiper-pagination {
    bottom: 0.75rem;

    .swiper-pagination-bullet {
      margin: 0 !important;
    }
  }

  .card-images-carousel .swiper-pagination-bullet-active {
    transition: width 0.4s ease;
    width: 24px;
    border-radius: 4px;
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: auto 1fr min-content auto;
    padding: 1rem;
    border-radius: 0.75rem;

    .card-images-carousel {
      height: 11rem;
      aspect-ratio: 1.59;
      border-radius: 8px;

      div,
      img {
        border-radius: 8px;
      }
    }

    .tour-tags {
      margin-top: 0.5rem;
      margin-bottom: 0;
    }
  }
`;

export const ProductCardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  @media (min-width: 769px) {
    gap: unset;
  }
`;

export const RatingsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;

  .star-icon {
    width: 0.75rem;
    height: 0.75rem;
    path {
      stroke: ${COLORS.TEXT.CANDY_1};
      fill: ${COLORS.TEXT.CANDY_1};
    }
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  .rating {
    color: ${COLORS.TEXT.CANDY_1};

    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  }

  .ratings-count {
    color: ${COLORS.TEXT.CANDY_1};

    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  }

  @media (min-width: 769px) {
    .star-icon {
      margin-top: 1px;
    }
    margin-bottom: 0.125rem;
    .rating {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    }

    .ratings-count {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    }
  }
`;

export const StyledProductTitle = styled.h5`
  margin: 0;
  color: ${COLORS.GRAY.G1};

  font-family: ${HALYARD.FONT_STACK};
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 22px;
`;

export const VeritcalDashedSeparator = styled.div`
  border: 0;
  border-left: 1px dashed ${COLORS.GRAY.G6};

  border-image: repeating-linear-gradient(
    to bottom,
    ${COLORS.GRAY.G6},
    ${COLORS.GRAY.G6} 4px,
    transparent 4px,
    transparent 10px
  );
  border-image-slice: 1;
  width: 0;
  display: none;

  @media (min-width: 768px) {
    display: block;
    margin-right: 0.25rem;
  }
`;

export const PricingAndCTASection = styled.div`
  .tour-scratch-price {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    color: ${COLORS.GRAY.G3};

    .strike-through {
      color: ${COLORS.GRAY.G3};
    }
  }

  .tour-price-container {
    gap: 0;
  }

  .tour-price {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
  }

  button {
    margin-top: 0.75rem;
    font-family: ${HALYARD.FONT_STACK};
    letter-spacing: unset;
  }

  .booking-link {
    grid-column: 1 / span 2;
    grid-row: 3/3;
    display: block;
  }

  .styled-price-block {
    gap: 0.125rem;
  }

  @media (min-width: 769px) {
    .tour-price {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }

    .styled-price-block {
      gap: 0.125rem;
    }
  }
`;
