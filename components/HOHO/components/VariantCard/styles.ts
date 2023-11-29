import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CardContainer = styled.div`
  position: relative;
`;

export const VariantCardWrapper = styled.div<{
  isSingleVariant?: boolean;
  isSkeleton?: boolean;
}>`
  width: 100%;
  height: max-content;
  overflow: hidden;
  background: ${COLORS.BRAND.WHITE};
  border: ${({ isSkeleton }) =>
    isSkeleton ? 'none' : `1px solid ${COLORS.GRAY.G6}`};
  border-radius: 12px;
  padding: ${({ isSkeleton }) => (isSkeleton ? '0' : '2rem 0 1.25rem')};
  box-sizing: border-box;
  margin-top: ${({ isSkeleton }) => (isSkeleton ? '0' : '0.25rem')};

  p,
  ul {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }

  .horizontal-line {
    padding-top: 1rem;
    margin: 0 1.25rem;
  }

  .button-wrapper {
    position: relative;
    border-radius: 8px;
    width: auto;
    margin: 0.75rem 1.25rem 0;
    text-align: center;
    cursor: pointer;
    ${expandFontToken(FONTS.BUTTON_MEDIUM)}
  }

  @media (max-width: 768px) {
    padding: 1.75rem 0 1.25rem;
    width: 18.75rem;

    ${({ isSingleVariant }) =>
      isSingleVariant &&
      `margin: 0.45rem 1.25rem 0;
       width: auto; `}
  }
`;

export const Name = styled.div`
  padding: 0 1.25rem;
  margin-bottom: 0.5rem;
  ${expandFontToken(FONTS.HEADING_REGULAR)}

  &.no-show {
    margin: 0;
    visiblility: hidden;
  }

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)}
  }
`;

export const PriceWrapper = styled.div<{
  $hasScratchPrice?: boolean;
  pageType?: string;
}>`
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  padding: 0 1.25rem;

  .tour-scratch-price {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;
    grid-column-gap: 0.25rem;
    ${expandFontToken(FONTS.SUBHEADING_XS)}

    .strike-through {
      color: ${COLORS.GRAY.G4};
    }
  }

  .tour-scratch-price.dummy {
    visibility: hidden;
  }

  .tour-price {
    display: flex;
    flex-direction: column;
    ${expandFontToken(FONTS.HEADING_SMALL)}

    .prefix {
      color: ${COLORS.GRAY.G3};
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }
  }

  @media (max-width: 768px) {
    grid-area: price-block;
    margin-bottom: 0.25rem;
    ${({ theme }) => theme.productCards.priceFontSettings.mobile}

    .styled-price-block {
      grid-column-gap: 0.25rem;
    }

    .tour-price-container .tour-price {
      margin-right: 0;
      ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
    }

    .tour-scratch-price {
      ${expandFontToken(FONTS.SUBHEADING_SMALL)};
    }

    .savedtag-block {
      ${expandFontToken(FONTS.MISC_TAG_REGULAR)};
    }
  }
`;

export const Description = styled.div`
  border-radius: 0 0 7px 7px;
  margin-top: 1rem;

  &.inclusions {
    background: linear-gradient(180deg, #f3f3f3 0%, #fff 67.5%);
    margin-top: -1.5rem;
    padding: 2.5rem 1.25rem 0;
    border-top: 1px solid ${COLORS.GRAY.G6};
  }

  .desc-list > .item {
    margin-bottom: 0.375rem;
    &.no-show {
      visibility: hidden;
    }
  }

  .booster-info :first-child {
    padding-bottom: 0.75rem;
  }

  &.boosters {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    padding: 0 1.25rem;

    .booster-info {
      display: grid;
      grid-template-columns: 1rem 1fr;
      gap: 0.5rem;
    }
    .image-wrap {
      height: 1rem;
      width: 1rem;
    }
  }

  .tooltip-container,
  .trigger.validity-info {
    display: inline-block;
  }

  .tooltip {
    top: 1.5rem;
    left: 10.25rem;
  }

  @keyframes moveInBottom {
    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0);
    }
  }

  .tooltip-swipesheet {
    animation: moveInBottom 250ms ease;
  }

  .trigger.validity-info {
    border-bottom: 1px dashed ${COLORS.GRAY.G3};
    padding: 0;
    margin: 0 0 0.375rem 0.375rem;
  }

  .desc-text,
  .trigger {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    padding-left: 0.375rem;
    color: ${COLORS.GRAY.G2};
  }

  .desc-list,
  .trigger {
    svg {
      margin-bottom: -0.188rem;
    }
  }
  @media (max-width: 768px) {
    .desc-list > .item,
    .booster-info {
      white-space: nowrap;
    }
  }
`;

export const BadgeWrapper = styled.div`
  position: absolute;
  right: 0.9rem;
  top: -0.325rem;
  z-index: 2;

  &.star {
    top: -0.2rem;
    right: 6.85rem;
    z-index: 3;
  }
`;

export const BadgeConnector = styled.div`
  position: absolute;
  right: 8rem;
  top: -1.063rem;
  z-index: 1;

  &.right {
    right: 0.7rem;
  }
`;

export const SingleCardContainer = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  width: 100%;
  min-height: 12.45rem;
  display: grid;
  grid-template-columns: 68% 32%;
  border-radius: 1rem;
  border: 1px solid ${COLORS.GRAY.G6};
  padding: 1.5rem 2.25rem 1.25rem 1.25rem;
  box-sizing: border-box;

  .horizontal-line {
    padding-top: 1rem;
    margin: 0 1.5rem 0 0;
  }

  .info-wrapper {
    border-right: 1px solid ${COLORS.GRAY.G6};
  }

  .cta-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: start;
    gap: 1rem;
    padding-left: 2.25rem;

    .button-wrapper {
      width: 100%;
    }
    
  }


  ${Name}, ${Description}, ${PriceWrapper} {
    padding: 0;
    background: ${COLORS.BRAND.WHITE};
    border: none;
  }

  ${Description} {
    margin: 1rem 0 0.5rem;

    &.boosters {
      display: flex;
      gap: 1.5rem;
      margin: 1rem 0 0;

      .booster-info {
        padding: 0;
      }
    }
  }

  .horizontal-line {
    padding-top: 0.75rem;
  }

  .desc-list {
    display: flex;
    flex-wrap: wrap;
    row-gap: 0.5rem;

    .item {
      margin-bottom: 0;
      flex: 0 0 33.333333%;
    }
    .trigger.validity-info {
      margin: 0 0 0 0.375rem;
    }
  }
`;
