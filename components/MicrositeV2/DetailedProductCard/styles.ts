import styled from 'styled-components';
import { IDetailedDescriptionCardProps } from 'components/MicrositeV2/DetailedProductCard/interface';
import { StlyedSplit } from 'UI/Split';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';

export const DetailedDescriptionCard = styled.div<
  IDetailedDescriptionCardProps
>`
  grid-column: 1 / 5;
  display: ${({ showDescCard }) => (showDescCard ? 'grid' : 'none')};
  grid-template-columns: 1fr 0.9fr;
  grid-column-gap: 24px;
  border: ${({ isEntertainmentMb }) =>
    isEntertainmentMb ? 'none' : `1px solid ${COLORS.GRAY.G3}`};
  color: ${COLORS.GRAY.G2};
  border-left: none;
  border-right: none;
  position: relative;
  ${({ isEntertainmentMb }) =>
    isEntertainmentMb &&
    `
      background-color: ${COLORS.GRAY.G8};
      padding: 0 32px 0 24px;
      border-radius: 4px;

      &::before {
        content: '';
        position: absolute;
        background: ${COLORS.GRAY.G8};
        border-top: 1px solid ${COLORS.GRAY.G6};
        border-bottom: 1px solid ${COLORS.GRAY.G6};
        height: 100%;
        top: 0;
        left: calc((1200px - 100vw) / 2);
        overflow: hidden;
      }
      .product-v2-description-left,
      .product-v2-description-right {
        z-index: 3;
      }
    `}
  ${StlyedSplit} {
    margin: 0;
    max-width: unset;
    padding: 0;
  }
  .v2-desc-title {
    font-size: 24px;
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '28px' : '1.37'};
    color: ${COLORS.GRAY.G2};
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 600;
  }
  .product-v2-description-right {
    padding: 24px 0;
  }
  .product-v2-description-left,
  .product-v2-description-right {
    display: grid;
    grid-gap: ${({ isEntertainmentMb, isListicle }) =>
      isListicle ? '16px' : isEntertainmentMb ? '32px' : '24px'};
  }
  .product-v2-description-right p,
  .product-v2-description-right h3 {
    ${({ isListicle }) => (isListicle ? 'margin: 0' : null)};
  }
  .product-v2-description-left {
    z-index: 1;
    display: flex;
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb && `padding: 24px 0; position: relative;`};
  }
  .v2-desc-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
    ${({ isListicle }) => (isListicle ? 'margin-bottom:16px' : '')};
  }

  .heading-price-bar {
    grid-template-columns: auto max-content;
  }

  .v2-desc-blocks .left {
    grid-column: 1;
  }
  .v2-desc-blocks .right {
    grid-column: 2;
  }
  .description-label {
    font-size: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '15px' : '16px'};
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '20px' : '1.4'};
    color: ${COLORS.GRAY.G2};
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 600;
  }
  .full-width-section {
    display: grid;
    grid-row-gap: 8px;
  }
  .v2-descriptors {
    display: grid;
    grid-template-columns: repeat(5, auto);
    font-family: ${HALYARD.FONT_STACK};
    grid-gap: 12px;
    justify-content: left;
    height: max-content;
  }
  .v2-descriptor {
    background: ${COLORS.GRAY.G6};
    border-radius: 2px;
    font-size: 12px;
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '6px 8px' : '8px 12px'};
    color: ${COLORS.GRAY.G3};
    font-weight: 400;
    line-height: ${({ isEntertainmentMb }) => (isEntertainmentMb ? '16px' : 1)};
    text-transform: capitalize;
  }
  .tour-description {
    font-family: ${HALYARD.FONT_STACK};
    margin-top: 4px;
  }

  .description-content {
    font-size: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '15px' : '16px'};
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '24px' : '1.37'};
    color: ${COLORS.GRAY.G2};
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 400;
    li,
    p {
      line-height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '24px' : '1.4'};
    }
    svg {
      margin-top: 8px;
    }
    ul {
      padding-left: 1em;
    }
    p {
      margin: 0;
    }
  }

  .desc-cta-price {
    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    align-self: end;
    grid-column-gap: 30px;
  }
  .v2-desc-right,
  .v2-desc-left {
    display: grid;
    grid-gap: ${({ isEntertainmentMb, isListicle }) =>
      isListicle ? '0px' : isEntertainmentMb ? '16px' : '24px'};
    align-items: start;
  }
  .show-summary-wrapper {
    margin-top: 8px;
  }

  .v2-desc-left {
    grid-auto-flow: row;
    grid-auto-rows: max-content;
  }
  .v2-desc-right {
    grid-template-rows:
      repeat(${({ rightBlocksCount }) => rightBlocksCount}, max-content)
      auto;
  }

  .v2-desc-left .full-width {
    grid-column: 1 / 3;
  }
  .desc-cta-wrapper {
    display: grid;
    align-items: center;
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb
        ? `
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 24px;
        justify-content: start;
        grid-auto-flow: row; 
        grid-auto-rows: max-content;
      `
        : `
        grid-template-columns: max-content;
        grid-column-gap: 12px;
        justify-content: end;
      `};

    ${({ experimentEnabled, isEntertainmentMb, isBroadway, showPageUrl }) =>
      (experimentEnabled && isEntertainmentMb) || (isBroadway && !showPageUrl)
        ? `
        grid-template-columns: 1fr 1fr;
        margin-left: 50%;
      `
        : ''}
  }

  .cta {
    border-radius: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '4px' : '2px'};
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '181px' : '150px'};
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '12px 0' : '16px'};
    ${({ experimentEnabled, isEntertainmentMb }) =>
      isEntertainmentMb && !experimentEnabled && 'max-width: 181px'};
  }
  .cta .cta-text {
    font-family: ${HALYARD.FONT_STACK};
    font-size: 16px;
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '20px' : '16px'};
    font-weight: 600;
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb && `letter-spacing: 0.6px; width: max-content;`}
  }
  .cta.primary {
    background: ${COLORS.BRAND.PURPS};
    cursor: pointer;
  }
  .cta.secondary {
    background: ${COLORS.BRAND.WHITE};
    border: 1px solid ${COLORS.GRAY.G2};
  }
  .cta.primary .cta-text {
    color: ${COLORS.BRAND.WHITE};
  }
  .cta.secondary .cta-text {
    color: ${COLORS.GRAY.G2};
  }

  .desc-price-wrapper {
    .scratch-price {
      span {
        color: ${COLORS.GRAY.G3};
        font-weight: 400;
        font-size: 14px;
        line-height: ${({ isEntertainmentMb }) =>
          isEntertainmentMb ? '16px' : '18px'};
      }
      .l-price {
        text-decoration: line-through;
      }
    }
    .price {
      display: grid;
      grid-template-columns: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? 'max-content max-content' : 'max-content'};
      .l-price {
        font-family: ${HALYARD.FONT_STACK};
        font-weight: 600;
        color: ${COLORS.GRAY.G2};
        font-size: ${({ isEntertainmentMb }) =>
          isEntertainmentMb ? '24px' : '20px'};
        line-height: ${({ isEntertainmentMb }) =>
          isEntertainmentMb ? '28px' : '20px'};
      }
      .discount {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${COLORS.BACKGROUND.SOOTHING_GREEN};
        color: ${COLORS.TEXT.OKAY_GREEN_3};
        padding: 2px 4px;
        border-radius: 2px;
        line-height: 16px;
        font-size: 12px;
        font-family: ${HALYARD.FONT_STACK};
        font-style: normal;
        font-weight: 400;
        margin-left: 8px;
      }
    }
  }

  .close-button {
    position: absolute;
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? `top: -8px; right: -8px;` : `top: 0; right: 0;`}
    background-color: #000;
    padding: ${({ isEntertainmentMb }) => (isEntertainmentMb ? '8px' : '16px')};
    cursor: pointer;
    display: flex;
    ${({ isEntertainmentMb }) => isEntertainmentMb && `border-radius: 16px;`}
  }
  .close-button svg {
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb &&
      `
        height: 12px;
        width: 12px;    
      `}
  }
  .close-button img {
    height: 11px;
    width: 11px;
  }
  .indicator-triangle::after,
  .indicator-triangle::before {
    border-width: 0;
    transition: all 0.5s ease;
  }
  .indicator-triangle {
    display: grid;
  }
  .indicator-triangle::after,
  .indicator-triangle::before {
    border-color: transparent transparent
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.GRAY.G6 : COLORS.GRAY.G3}
      transparent;
    border-style: solid;
    border-width: 13px;
    content: '';
    grid-row: 1;
    grid-column: 1;
    align-self: end;
    justify-self: center;
  }
  .indicator-triangle::after {
    border-color: transparent transparent
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.GRAY.G8 : COLORS.BRAND.WHITE}
      transparent;
    border-width: 12px;
    transform: translateY(2px);
  }
  .indicator-triangle {
    position: absolute;
    transform: translateY(-100%) translateX(-50%);
    top: 0;
    z-index: 0;
    left: ${({ cardPosition }) => 25 * cardPosition - 12.5}%;
  }
  .product-v2-description-left img {
    width: 100%;
    height: 100%;
    object-fit: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'contain' : 'cover'};
    ${({ isEntertainmentMb }) => isEntertainmentMb && `border-radius: 4px`};
  }
  .tour-description p {
    margin: 0;
  }

  .tour-description svg {
    margin-top: 8px;
  }

  .tour-description p {
    margin: 0;
  }
`;

export const IconBoosters = styled.div`
  margin-bottom: 16px;
  margin-left: 16px;
  ${StlyedSplit} {
    grid-column-gap: 29px;
  }
`;
