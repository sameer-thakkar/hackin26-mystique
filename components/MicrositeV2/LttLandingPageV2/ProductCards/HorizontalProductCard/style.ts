import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Wrapper = styled.div<{
  hoverEffect: boolean;
  isVerticalImageUrlPresent: boolean;
}>`
  display: flex;
  flex-direction: row;
  position: relative;

  ${({ hoverEffect }) =>
    hoverEffect &&
    `transition: ease 0.2s;
      &:hover {
        transform: translate3d(0, -5px, 0);
      }`}
  img, svg {
    border-radius: 4px;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
    &::after {
      content: '';
    }
  }
  .pinned-card-image,
  .image-placeholder {
    width: 108px;
    min-width: 108px;
    min-height: 162px;
    margin-right: 0.75rem;
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
    font-weight: 400;
    margin: 0;
    margin-bottom: 4px;
  }

  .descriptors {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    text-transform: uppercase;

    svg {
      margin: 0 4px;
      margin-top: 1px;
    }
    ${expandFontToken(FONTS.SUBHEADING_XS)};
    color: ${({ darkTheme }) => (darkTheme ? COLORS.GRAY.G6 : COLORS.GRAY.G3)};
    margin-bottom: 4px;
  }

  .average-rating {
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    margin-right: 3px;
  }

  .count {
    ${expandFontToken(FONTS.UI_LABEL_XS)};
    color: ${({ darkTheme }) =>
      darkTheme ? `rgba(255,255,255,0.8)` : COLORS.GRAY.G3} !important;
    margin-left: 4px;
  }

  .tour-scratch-price {
    margin-top: 0.75rem;
    &,
    & span {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      color: ${({ darkTheme }) =>
        darkTheme ? COLORS.GRAY.G6 : COLORS.GRAY.G3};
    }
  }

  .tour-price-container {
    &,
    & span {
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
      color: ${({ darkTheme }) =>
        darkTheme ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
    }
  }

  .tags {
    margin-top: 2px;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    font-weight: 500;
    color: ${({ darkTheme }) =>
      darkTheme ? COLORS.GRAY.G7 : COLORS.TEXT.BEACH};
  }
`;
