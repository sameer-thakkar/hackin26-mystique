import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div`
  position: relative;
  height: 351px;
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 2.5rem;
  padding-bottom: 1.6875rem;

  h2 {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.BRAND.WHITE};
    margin-bottom: 1.5rem;
    margin-top: 0;
  }

  .mweb-wrapper {
    position: relative;
    background: rgba(255, 255, 255, 0.15);
    z-index: 1;
    border-radius: 4px;
    .show-title {
      margin-top: 0.75rem;
    }
    .pinned-card-image {
      min-height: 162px;
      min-width: 108px;
      img {
        height: 100%;
        text-indent: 100%;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .count {
      color: rgba(255, 255, 255, 0.8);
    }

    .tour-scratch-price {
      &,
      & span {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    height: auto;

    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin-bottom: 1.25rem;
    }
  }
`;

export const Wrapper = styled.div<{ isVerticalImageUrlPresent: boolean }>`
  display: flex;
  flex-direction: row;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.25rem;
  position: relative;
  .pinned-card-image,
  .image-placeholder {
    height: auto;
    width: auto;
    min-height: 260px;
    min-width: 180px;

    margin-right: 2rem;
    img,
    svg {
      height: 100%;
      border-radius: 4px 0px 0px 4px;
      text-indent: 100%;
      white-space: nowrap;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      margin-right: 0.75rem;
      margin-bottom: 1.6875rem;
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
  }
`;

export const ProductDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  padding: 1.75rem 2rem 0 0;
  width: 100%;
  .left {
    height: 100%;
    width: auto;

    .count {
      color: rgba(255, 255, 255, 0.8);
    }

    .primary-descriptors {
      display: flex;
      align-items: center;
      margin-top: 0.75rem;

      .descriptor {
        color: ${COLORS.BRAND.WHITE};
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
        padding: 0.375rem 0.5rem;
        margin-right: 0.5rem;
        border-radius: 0.25rem;
        background: rgba(255, 255, 255, 0.12);
      }
    }
    h3 {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
      color: ${COLORS.BRAND.WHITE};
      margin: 0;
      margin-bottom: 0.5rem;
    }

    .tags {
      margin-top: 0.75rem;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
      color: ${COLORS.OCEAN_BLUE.TERTIARY};
    }

    @media (max-width: 768px) {
      width: 208px;
    }
  }

  .right {
    padding-left: 1.56rem;
    height: 100%;
    max-width: 19.19rem;
    border-image: linear-gradient(to bottom, #ffffff20, transparent) 1;
    border-width: 0;
    border-left-width: 1px;
    border-style: solid;
    .tour-scratch-price {
      &,
      & span {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .tour-price-container {
      &,
      & span {
        ${expandFontToken(FONTS.HEADING_REGULAR)};
        color: ${COLORS.BRAND.WHITE};
      }
    }

    button {
      margin-top: 1.5rem;
      ${expandFontToken(FONTS.BUTTON_MEDIUM)};
      color: ${COLORS.GRAY.G2};
      background-color: ${COLORS.BRAND.WHITE};
      border-radius: 6px;
      width: 232px;
      cursor: pointer;
      z-index: 2;
      position: relative;
    }

    .price-wrapper {
      display: flex;
      align-items: flex-end;
      .booster {
        padding: 0.125rem 0.5rem;
      }
    }

    .banner-cta-button:hover {
      box-shadow: 0px 8px 15px 0px rgba(255, 255, 255, 0.24);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const SecondaryDescriptors = styled.div<{ count: number }>`
  margin-top: 1.5rem;
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  column-gap: 1rem;

  ${({ count }) =>
    count
      ? `
        > :nth-child(-n + ${count / 2}) {
      grid-column: 1;
      }
      > :nth-child(n + ${count / 2 + 1}) {
      grid-column: 2;
      }
    `
      : ``};

  width: 28.25rem;
  .descriptor {
    display: flex;
    align-items: center;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.75rem;

    svg {
      margin-right: 0.75rem;
      path {
        stroke: rgba(255, 255, 255, 0.9);
      }
    }
  }
`;

export const Gradient = styled.div`
  position: absolute;
  width: 110%;
  height: 600px;
  left: -5%;
  bottom: -60px;
  transform: perspective(2000px) rotateX(-30deg) scaleX(1);
  background: linear-gradient(
    180deg,
    rgba(49, 18, 59, 0) 50%,
    rgba(246, 112, 192, 0.2) 87.8%
  );
  filter: blur(6px);
  z-index: 0;
  @media (max-width: 768px) {
    width: 105%;
    left: -3.5%;
  }
`;
