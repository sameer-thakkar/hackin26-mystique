import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { SIZES } from 'const/ui-constants';

export const Container = styled.div`
  background: ${COLORS.BACKGROUND.FLOATING_PURPS};

  .content-wrapper {
    max-width: ${SIZES.MAX_WIDTH};
    margin: auto;
    padding: 0 0 1rem 0;

    @media (max-width: 768px) {
      display: block;
      overflow: hidden;
      padding: 1.875rem 0;
    }
  }
`;

export const TextContainer = styled.div`
  .heading-wrapper {
    margin: 0;
    width: fit-content;
    padding-top: 3rem;
    color: ${COLORS.BRAND.BLACK};
    ${expandFontToken(FONTS.DISPLAY_REGULAR)}
    background: linear-gradient(90deg, ${COLORS.BRAND.PURPS} 0%, ${
  COLORS.TEXT.CANDY_1
} 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  @media (max-width: 768px) {
     padding-bottom: 2rem;
    .heading-wrapper {
      ${expandFontToken(FONTS.HEADING_LARGE)}
      padding: 0 0 0 1rem;
    }
  }
`;

export const CardsContainer = styled.div`
  z-index: 2;
  position: relative;
  .prev-slide,
  .next-slide {
    top: 11.5rem;
  }

  @media (max-width: 768px) {
    margin-left: 1rem;
    width: auto;
  }
`;

export const Card = styled.div<{ height: string; width: string }>`
  .attraction-image-wrapper {
    position: relative;
    width: ${({ width }) => `${width}px`};
    height: ${({ height }) => `${height}px`};
    overflow: hidden;
    border-radius: 8px;

    .gradient-wrapper {
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.64) 53.65%
      );
      position: absolute;
      bottom: 0px;
      height: 5.62rem;
      width: 100%;
      padding-top: 2rem;
    }

    .attraction-image {
      transition: 0.3s ease-in-out;
      img {
        z-index: -1;
        position: relative;
        border-radius: 8px;
      }
    }

    .attraction-image:hover {
      transform: scale(1.06);
    }

    .card-info-wrapper {
      position: absolute;
      bottom: 0;
      padding: 0.75rem;
      .attraction-name {
        color: ${COLORS.BRAND.WHITE};
        ${expandFontToken(FONTS.HEADING_REGULAR)}
      }
      .attraction-price {
        ${expandFontToken(FONTS.UI_LABEL_LARGE)}
        span {
          color: ${COLORS.BRAND.WHITE};
        }
      }
      @media (max-width: 768px) {
        padding: 0.5rem;
        .attraction-name {
          ${expandFontToken(FONTS.HEADING_XS)}
          padding-bottom: 0.25rem;
        }
        .attraction-price {
          ${expandFontToken(FONTS.UI_LABEL_XS)}
        }
      }
    }
  }
`;
