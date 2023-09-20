import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const Wrapper = styled.div<{
  darkTheme: boolean;
  hoverEffect: boolean;
  isVerticalImageUrlPresent: boolean;
}>`
  display: flex;
  flex-direction: column;
  display: relative;
  margin: 0;
  user-select: none;
  cursor: pointer;
  max-width: 11.25rem;

  ${({ hoverEffect }) =>
    hoverEffect &&
    `transition: ease 0.2s;
      &:hover {
        transform: translate3d(0, -5px, 0);
      }`}

  .pinned-card-image {
    width: auto;
    margin-right: 0.75rem;
  }

  .image-placeholder {
    ${({ isVerticalImageUrlPresent }) =>
      isVerticalImageUrlPresent &&
      `
    position: absolute;
    `}
    top: 0;
    z-index: -1;
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
        border-radius: 4px;
      }`}
    img {
      border-radius: 4px;
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
        darkTheme ? COLORS.GRAY.G5 : COLORS.GRAY.G3};
    }
    .average-rating {
      margin-right: 3px;
    }

    .count {
      color: ${({ darkTheme }) =>
        darkTheme ? COLORS.GRAY.G5 : COLORS.GRAY.G4};
      margin-left: 4px;
    }
  }

  p {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
    font-weight: 300;
    color: ${({ darkTheme }) =>
      darkTheme ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
    font-weight: 300;
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
        darkTheme ? COLORS.GRAY.G4 : COLORS.GRAY.G4};
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
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${({ darkTheme }) =>
      darkTheme ? COLORS.GRAY.G7 : COLORS.OCEAN_BLUE.TERTIARY};
  }

  @media (max-width: 768px) {
    width: 120px;

    .row {
      .subcategory-name {
        ${expandFontToken(FONTS.SUBHEADING_XS)};
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
      font-weight: 300;
    }
    p {
      ${expandFontToken(FONTS.SUBHEADING_XS)};
      margin-top: 2px;
    }

    .tour-scratch-price {
      margin-top: 6px;
      &,
      & span {
        ${expandFontToken(FONTS.UI_LABEL_XS)};
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
  margin-top: 0.375rem;
  padding: 0.125rem 0.25rem;
  background: ${COLORS.BACKGROUND.SOOTHING_GREEN};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  max-width: fit-content;
  border-radius: 4px;
  .booster-text {
    font-family: ${HALYARD.FONT_STACK};
    color: ${COLORS.TEXT.OKAY_GREEN_3};
    font-size: 10px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0.006em;
    text-align: left;
  }
  @media (max-width: 768px) {
    border-radius: 2px;
  }
`;
