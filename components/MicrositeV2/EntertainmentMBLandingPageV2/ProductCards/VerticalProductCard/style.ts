import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div<{
  darkTheme: boolean;
  hoverEffect: boolean;
  isVerticalImageUrlPresent: boolean;
}>`
  display: flex;
  flex-direction: column;
  display: relative;
  margin: 0;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  cursor: pointer;
  max-width: 11.25rem;
  transition: ease-in-out 150ms;

  ${({ hoverEffect }) =>
    hoverEffect &&
    `
      &:hover {
        transform: translate3d(0, -5px, 0);
      }`}

  :active {
    transition: ease-in-out 150ms;
    transform: scale(0.98);
  }
  .pinned-card-image {
    width: auto;
    margin-right: 0.75rem;
  }
  .image-wrap {
    img {
      height: 16.875rem;
      width: 11.25rem;
    }
  }

  .image-placeholder {
    ${({ isVerticalImageUrlPresent }) =>
      isVerticalImageUrlPresent &&
      `
        position: absolute;
    `}
    top: 0;
    z-index: -1;
    &,
    svg {
      border-radius: 0.5rem;
    }
  }

  .pinned-card-vertical-image {
    z-index: 0;
    min-width: 180px;
    min-height: 270px;

    ${({ darkTheme }) =>
      darkTheme &&
      `&::after {
        position: absolute;
        top: -2px;
        bottom: -2px;
        left: -2px;
        right: -2px;
        width: 184px;
        height: 274px;
        content: '';
        border-radius: 0.5rem;
      }`}
    img {
      border-radius: 0.5rem;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
        0px -1px 2px 0px rgba(0, 0, 0, 0.08);
      text-indent: 100%;
      white-space: nowrap;
      overflow: hidden;
      &::after {
        display: none;
      }
    }
  }
  @media (max-width: 768px) {
    width: 120px;
    max-width: initial;

    &:hover {
      transform: none;
    }
    :active {
      transition: ease-in-out 150ms;
      transform: scale(0.98);
    }
    .pinned-card-vertical-image {
      min-width: 120px;
      min-height: 180px;
      ${({ darkTheme }) =>
        darkTheme &&
        `&::after {
          width: 124px;
          height: 184px;
      }`}
    }
  }
`;

export const ProductDetails = styled.div<{ darkTheme: boolean }>`
  height: 100%;
  width: 180px;

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 4px;

    .subcategory-name {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      font-weight: 300;

      color: ${({ darkTheme }) =>
        darkTheme ? `${COLORS.BRAND.WHITE}BF` : COLORS.GRAY.G3};
    }

    ${({ darkTheme }) =>
      darkTheme &&
      `
      .count, .average-rating {
        color: ${COLORS.CANDY.LIGHT_TONE_1}
      }
      svg {
        path {
          stroke:${COLORS.CANDY.LIGHT_TONE_1};
          fill:${COLORS.CANDY.LIGHT_TONE_1};
        }
      }
      
      `};
  }

  p {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
    color: ${({ darkTheme }) =>
      darkTheme ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
    letter-spacing: 0.6;
    margin: 0;
    margin-top: 4px;
  }

  .tour-scratch-price {
    margin-top: 0.5rem;
    &,
    & span {
      ${expandFontToken(FONTS.SUBHEADING_XS)};
      color: ${({ darkTheme }) =>
        darkTheme ? `${COLORS.BRAND.WHITE}99` : COLORS.GRAY.G4};
    }
  }

  .tour-price-container {
    &,
    & span {
      ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
      color: ${({ darkTheme }) =>
        darkTheme ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
    }
  }

  .tags {
    margin-top: 4px;
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: ${({ darkTheme }) =>
      darkTheme ? COLORS.GRAY.G7 : COLORS.TEXT.BEACH};
  }

  @media (max-width: 768px) {
    width: 120px;

    .row {
      .subcategory-name {
        ${expandFontToken(FONTS.UI_LABEL_XS)};
        font-weight: 300;
      }
      .average-rating {
        ${expandFontToken(FONTS.UI_LABEL_XS)};
        margin-right: 2px;
      }
    }
    .tags {
      margin-top: 2px;
      ${expandFontToken(FONTS.PARAGRAPH_XS)};
    }
    p {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      margin-top: 2px;
    }

    .tour-scratch-price {
      margin-top: 6px;
      &,
      & span {
        ${expandFontToken(FONTS.UI_LABEL_XS)};
        font-weight: 300;
      }
    }

    .tour-price-container {
      &,
      & span {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      }
    }
  }
`;

export const ExclusivePricesBooster = styled.div`
  margin-top: 0.34rem;

  @media (max-width: 768px) {
    margin-top: 0.59rem;
    .booster-text {
      & svg {
        margin-right: -0.0625rem;
      }
    }
  }
`;
