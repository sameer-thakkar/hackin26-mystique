import styled from 'styled-components';
import { StyledPriceBlock } from 'UI/PriceBlock';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.a<{
  hoverEffect: boolean;
  isVerticalImageUrlPresent: boolean;
}>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 20.4375rem;
  height: 8.1875rem;
  transition: all ease-in-out 150ms;

  &:active {
    img {
      box-shadow: 0px 3.92px 7.84px 0px rgba(0, 0, 0, 0.12),
        0px -0.98px 1.96px 0px rgba(0, 0, 0, 0.08);
    }
  }

  ${({ hoverEffect }) =>
    hoverEffect &&
    `transition: ease 0.2s;
      &:hover {
        transform: translate3d(0, -5px, 0);
      }`}
  img, svg {
    border-radius: 0.5rem;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
    height: 100%;
    &::after {
      content: '';
    }
  }
  img {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12),
      0px -1px 2px 0px rgba(0, 0, 0, 0.08);
  }
  .pinned-card-image,
  .image-placeholder,
  img {
    width: 5.5rem;
    height: 8.1875rem;
    z-index: 0;
  }

  .image-placeholder {
    ${({ isVerticalImageUrlPresent }) =>
      isVerticalImageUrlPresent &&
      `
    position: absolute;
    `};
    left: 0;
    top: 0;
    z-index: -1;
    svg {
      height: 100%;
    }
  }

  @media (max-width: 768px) {
    height: unset;
    width: unset;
    &:hover {
      transform: none;
    }
  }
`;

export const ProductDetails = styled.div<{ darkTheme: boolean }>`
  height: 100%;

  .show-title {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
    color: ${({ darkTheme }) =>
      darkTheme ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
    margin: 0;
    margin-bottom: 0.40625rem;
  }

  .descriptors {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    text-transform: uppercase;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${({ darkTheme }) => (darkTheme ? COLORS.GRAY.G6 : COLORS.GRAY.G3)};
    margin-bottom: 0.25rem;
  }

  .average-rating {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    margin-right: 0.125rem;
  }

  .count {
    ${expandFontToken(FONTS.UI_LABEL_XS)};
    color: ${({ darkTheme }) =>
      darkTheme ? `rgba(255,255,255,0.8)` : COLORS.CANDY.LIGHT_TONE_1};
  }

  .tour-scratch-price {
    margin-top: 0.5rem;
    &,
    & span {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      color: ${({ darkTheme }) =>
        darkTheme ? COLORS.GRAY.G6 : COLORS.GRAY.G4};
    }
  }

  .tour-price-container {
    &,
    & span {
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
      line-height: 1.0625rem;
      color: ${({ darkTheme }) =>
        darkTheme ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
    }
  }

  .tags {
    margin-top: 2px;
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    color: ${({ darkTheme }) =>
      darkTheme ? COLORS.GRAY.G7 : COLORS.TEXT.BEACH};
  }
  ${StyledPriceBlock} {
    grid-column-gap: 0.375rem;
  }

  .price-wrapper {
    display: flex;
    flex-direction: row;
    align-items: end;

    & .booster-text {
      margin-bottom: -0.0625;
    }
  }
`;
