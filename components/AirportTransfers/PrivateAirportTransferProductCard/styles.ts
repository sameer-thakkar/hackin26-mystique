import styled, { css } from 'styled-components';
import { SidePanel } from 'components/Product/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const VeritcalDashedSeparator = styled.div`
  margin: 2rem 0;

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
`;

export const StyledProductCardContainer = styled.div`
  box-sizing: border-box;
  max-width: 75rem;
  margin: 0 auto;
  width: 100%;
  max-height: 14rem;

  display: grid;
  grid-template-columns: auto 1fr min-content auto;

  border-radius: 1rem;
  border: 1px solid ${COLORS.GRAY.G6};
  background: white;

  .card-images-carousel {
    aspect-ratio: 1.186;
    width: 15.5rem;
    height: 100%;
    position: relative;

    img {
      object-fit: cover;
      border-radius: 1rem 0rem 0rem 1rem;
    }

    div {
      border-radius: 1rem 0rem 0rem 1rem;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 100%;

    max-height: max-content;

    .card-images-carousel {
      width: 100%;
      height: 10.5625rem;

      div,
      img {
        border-radius: 0.5rem 0.5rem 0rem 0rem;
      }
    }

    ${VeritcalDashedSeparator} {
      display: none;
    }
  }
`;

export const StyledProductCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem 0;
    margin: 0 1rem;

    border: 0;
    border-bottom: 1px dashed ${COLORS.GRAY.G6};

    border-image: repeating-linear-gradient(
      to right,
      ${COLORS.GRAY.G6},
      ${COLORS.GRAY.G6} 6px,
      transparent 6px,
      transparent 10px
    );
    border-image-slice: 1;
  }
`;

export const StyledProductTitle = styled.h3`
  margin: 0;
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
`;

export const LineSeparator = styled.div`
  border-right: 1px solid ${COLORS.GRAY.G6};
  height: 100%;
  margin: 0 0.15rem;
`;

export const RatingAndDurationContainer = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 0.5rem;

  svg {
    width: 0.875rem;
    height: 0.875rem;
    vertical-align: middle;
  }

  .rating {
    color: ${COLORS.TEXT.CANDY_1};
    margin: 0 0.2rem;

    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
  }

  .ratings-count {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${COLORS.TEXT.CANDY_1};
  }

  ${LineSeparator} {
    margin: 0 0.5rem;
  }

  .ride-duration {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};

    color: ${COLORS.GRAY.G3};

    svg {
      margin-right: 0.38rem;
    }

    svg path {
      stroke: ${COLORS.GRAY.G3};
    }
  }
`;

export const DescriptorsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;

  @media (max-width: 768px) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    ${LineSeparator} {
      display: none;
    }
  }
`;

export const StyledDescriptorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;

  .descriptor-text {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${COLORS.GRAY.G2};
  }

  @media (max-width: 768px) {
    svg {
      flex-shrink: 0;
    }
    .descriptor-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const LocationFromToDesktop = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};

  display: grid;

  grid-template-columns: auto 1fr;
  grid-row-gap: 0.75rem;
  grid-column-gap: 0.38rem;
  align-items: center;
  position: relative;
  margin-bottom: 0.5rem;

  .anywhere-chip {
    border-radius: 0.8125rem;
    background: ${COLORS.GRAY.G8};
    padding: 0.25rem 0.5rem;
  }

  .dotted-line {
    position: absolute;
    border-right: 0.0625rem dashed ${COLORS.GRAY.G4A};
    height: 1.1875rem;

    left: 0.3125rem;
    top: 0.85rem;
  }
`;

export const LocationFromAndToMobile = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 0.5rem;

  span {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G3};
  }

  svg {
    margin-right: 0.25rem;
  }

  .swap {
    margin: 0.5rem;
  }

  svg path {
    fill: ${COLORS.GRAY.G3};
  }
`;

export const MoreDetailsButton = styled.button`
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  color: ${COLORS.TEXT.PURPS_3};

  display: flex;
  align-items: center;

  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  svg {
    margin-left: 0.25rem;
  }

  @media (max-width: 768px) {
    display: none;
    -webkit-tap-highlight-color: transparent;
  }
`;

export const PricingAndCTASection = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content max-content;
  grid-template-rows: repeat(4, auto);
  justify-content: space-between;
  align-content: center;
  align-items: center;

  padding: 2rem;

  .scratch-price {
    ${expandFontToken(FONTS.SUBHEADING_XS)}
    color: ${COLORS.GRAY.G3};

    .scratch-price-amount {
      color: ${COLORS.GRAY.G3};
      text-decoration: line-through;
    }
  }

  .price {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    color: ${COLORS.GRAY.G3};
    ${expandFontToken(FONTS.HEADING_REGULAR)};
  }

  button:first-child {
    margin-top: 1.25rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .more-details {
      margin-top: 0.5rem;
      grid-column: span 2;
    }
  }

  .booking-link {
    grid-column: 1 / span 2;
    grid-row: 3/3;
    display: block;
  }
`;

export const StyledCashback = styled.div`
  grid-row: span 2;
  position: relative;
  background: linear-gradient(270deg, #ffcc002b, transparent);
  border-radius: 10px;
  z-index: 2;

  &:before {
    content: '';
    position: absolute;
    inset: 1px;
    z-index: 2;
    background: linear-gradient(to left, #fff9de, transparent);
    border-radius: 10px;
    opacity: 0.7;
    z-index: -2;
  }

  padding: 0.59rem;

  grid-row: span 2;
  font-family: 'halyard-text';

  display: flex;
  align-items: center;
  justify-content: end;

  gap: 0.21rem;

  .top-text {
    display: block;
    font-size: 0.78888rem;
    font-weight: 600;
    color: ${COLORS.TEXT.JOY_MUSTARD_3};
  }

  .bottom-text {
    font-size: 0.52594rem;
    color: ${COLORS.TEXT.JOY_MUSTARD_3};
    font-weight: 500;
  }
`;

export const mobileDrawerStyles = css`
  height: 65vh;

  .product-details-drawer {
    row-gap: 0.75rem;
  }

  .close-icon {
    grid-row: 2 !important;
    align-self: center;
    margin-left: auto;
  }

  .tabs-wrapper {
    margin: 0 -1.5rem;

    .swiper {
      padding: 0 1.5rem;
    }

    .tab {
      ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
      color: ${COLORS.GRAY.G4A};
    }

    .tab.active {
      color: ${COLORS.TEXT.PURPS_3};
      border-bottom-color: ${COLORS.TEXT.PURPS_3};
    }
  }

  ul {
    padding-inline-start: 1.2rem;
  }

  .tab-panel {
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
    color: ${COLORS.GRAY.G3};

    overflow-y: auto;

    max-height: 35vh;

    ul {
      padding-bottom: 4rem;
    }
  }

  ${PricingAndCTASection} {
    padding: 0.88rem 1.5rem;
    margin: 0 -1.5rem;
    grid-template-rows: auto auto;
    align-items: center;

    position: fixed;
    bottom: 0;
    width: calc(100% - 3rem);
    background-color: white;
    z-index: 1;
    box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.08);

    .booking-link {
      grid-column: 2/2;
      grid-row: 2/2;
      align-self: center;
      display: block;

      width: 11.75rem;

      button {
        margin: 0;
        display: block;
      }
    }
  }
`;

// SideDrawer

export const FullHeightDrawer = styled(SidePanel)`
  height: 100vh;
  top: 0;
  overflow-y: hidden;
  width: clamp(32rem, 42vw, 60vw);
  padding: 0;
`;

export const ContentHeader = styled.div`
  padding: 2rem 2rem 1.25rem 2rem;

  ${StyledProductTitle} {
    ${expandFontToken(FONTS.HEADING_LARGE)}
  }

  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);

  .review-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .close {
      box-sizing: border-box;
      cursor: pointer;
      display: block;
      display: flex;
      align-items: center;
      justify-content: center;

      width: 1.75rem;
      height: 1.75rem;

      svg path {
        stroke: white;
        vertical-align: middle;
      }

      background-color: ${COLORS.GRAY.G3};
      border-radius: 0.5rem;
      border: 1px solid ${COLORS.GRAY.G5};
    }
  }
`;

export const RatingsContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 1rem;
    height: 1rem;
  }

  .rating {
    color: ${COLORS.TEXT.CANDY_1};
    margin: 0 0.56rem;

    ${expandFontToken(FONTS.HEADING_REGULAR)}
  }

  .ratings-count {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
    color: ${COLORS.GRAY.G3};
  }
`;

export const StyledPricingAndCTA = styled.div`
  padding: 1.25rem 2rem 1.5rem 2rem;
  box-shadow: 0px -2px 12px 0px rgba(84, 84, 84, 0.1);

  position: absolute;
  bottom: 0;
  background-color: ${COLORS.BRAND.WHITE};
  width: calc(100% - 4rem);

  display: grid;
  grid-template-columns: 1fr 14.375rem;
  grid-auto-flow: column;

  .scratch-price {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    color: ${COLORS.GRAY.G3};

    .scratch-price-amount {
      color: ${COLORS.GRAY.G3};
      text-decoration: line-through;
    }
  }

  .price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    ${expandFontToken(FONTS.HEADING_REGULAR)};
    font-size: 1.5rem;
  }

  a {
    display: block;
    grid-row: span 2;
  }
`;

export const StyledContentContainer = styled.div`
  padding: 1.5rem 2rem 6rem;
  display: flex;
  flex-direction: column;

  overflow-y: auto;

  max-height: calc(100vh - 14rem);

  h6 {
    ${expandFontToken(FONTS.HEADING_LARGE)};
    margin: 0;
  }

  li,
  p {
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
    color: ${COLORS.GRAY.G2};
  }

  section:not(:first-child) {
    margin-top: 2rem;
  }
`;
