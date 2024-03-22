import styled, { css, keyframes } from 'styled-components';
import HorizontalLine from 'components/slices/HorizontalLine';
import { SavedTag, StyledPriceBlock } from 'UI/PriceBlock';
import { StlyedSplit } from 'UI/Split';
import { pxToRem } from 'utils/cssUtils';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { CUSTOM_TYPES, THEMES } from 'const/index';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const CancellationPolicyHoverCard = styled.p`
  background: ${COLORS.BRAND.WHITE};
  position: absolute;
  top: 100%;
  left: 0;
  width: 13.375rem;
  ${expandFontToken(FONTS.PARAGRAPH_SMALL)}
  height: max-content;
  text-wrap: wrap;
  padding: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.75rem 0 #0000001a, 0 0 0.0625rem 0 #0000001a;
  z-index: 10;

  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
`;

export const HLine = styled.div<{ $isDashed?: boolean }>`
  grid-area: hline;
  width: 100%;
  height: 0;
  border-bottom: ${({ $isDashed }) =>
    `1px ${$isDashed ? 'dashed' : 'solid'} ${COLORS.GRAY.G6}`};
`;

export const TourTags = styled.div<{ horizontal?: boolean; pageType?: string }>`
  ${expandFontToken('UI/Label Regular')}
  display: grid;
  grid-row-gap: 1rem;
  align-items: start;
  align-content: start;
  margin: 0;
  margin-top: 0.5rem;
  color: ${COLORS.GRAY.G3};
  ${({ horizontal }) =>
    horizontal &&
    `
    display: flex;
    white-space: nowrap;
    flex-wrap: wrap;
    gap: 0.5rem;
  `}
  .tour-tag {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 0.5rem;
    margin-right: 0.5rem;
    max-width: 14.375rem;
    justify-content: left;
    align-items: center;
    margin-bottom: 0;
    .image-wrap {
      display: flex;
      align-items: start;
      padding-top: calc(100% / 2);
    }
    img {
      height: 1rem;
      width: 1rem;
      object-fit: cover;
    }
    ${({ pageType }) =>
      pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
        ? `line-height: 1.25rem;
            color: #444444;`
        : ''}

    &.free-cancellation {
      text-decoration: underline;
      position: relative;
      cursor: pointer;

      &:hover {
        ${CancellationPolicyHoverCard} {
          visibility: visible;
          opacity: 1;
        }
      }
    }
  }
  @media (max-width: 768px) {
    grid-area: tags;
    align-items: start;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    margin-top: -0.5rem;
    margin-bottom: -0.5rem;
    .tour-tag {
      margin: 0;
      flex-basis: calc((100% - 2rem) / 2);
      flex-grow: 1;
    }
    .language-descriptor {
      min-width: max-content;
      max-width: calc(100% - 2rem);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;

export const NextAvailableBlock = styled.div<{
  $isExperimentalCard?: boolean;
  $isDrawer?: boolean;
}>`
  ${({ theme }) => theme.productCards?.nextAvailable?.desktop};
  color: ${COLORS.GRAY.G3};

  @media (max-width: 768px) {
    grid-area: next-available;
    margin-top: ${({ $isExperimentalCard, $isDrawer }) =>
      $isExperimentalCard ? ($isDrawer ? '-0.75rem' : '-0.65rem') : '-1rem'};
    color: ${COLORS.GRAY.G3};
  }
`;

export const GuidedTourLabel = styled.span`
  position: absolute;
  top: 0;
  z-index: 2;
  width: 9.4375rem;
  height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  left: calc((100% - 9.4375rem) / 2);
  color: ${COLORS.PURPS.DARK_TONE};
  ${expandFontToken(FONTS.HEADING_XS)}
  text-transform: uppercase;
  svg {
    position: absolute;
    z-index: -1;
    top: 0;
    filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.1))
      drop-shadow(0 0 1px rgba(0, 0, 0, 0.1));
  }
  @media (max-width: 768px) {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    width: 9.25rem;
    height: 1.375rem;
    left: calc((100% - 9.25rem) / 2);
  }
`;

export const Container = styled.div<{
  isCardVisible?: boolean;
  isV3Design?: boolean;
  indexPosition: number;
  isSmallComboCard?: boolean;
}>`
  display: ${({ isCardVisible }) => (isCardVisible ? 'block' : 'none')};

  max-width: 1200px;
  margin: auto;
  width: 100%;
  position: relative;
  ${({ isV3Design, indexPosition }) =>
    isV3Design &&
    `
    border-top: 1px solid ${COLORS.GRAY.G4A};
    background-color: ${COLORS.GRAY.G8};
    min-height: 400px;
  
  .indicator-triangle::before {
    border-color: transparent transparent ${COLORS.GRAY.G4A};
    border-width: 12px;
    border-style: solid;content: "";
    position: absolute;
    top: -24px;
    // use indexPosition to find the position of card in overall list and % 4 to find the order in a single row
    // and use this info to find a perfect fir for arrow from left
    left: ${25 * (((indexPosition + 4) % 4) + 1) - 14.5}%;
  }

  .indicator-triangle::after {
    border-color: transparent transparent ${COLORS.GRAY.G8};
    border-width: 12px;
    border-style: solid;
    content: "";
    position: absolute;
    top: -22px;
    left: ${25 * (((indexPosition + 4) % 4) + 1) - 14.5}%;
    transform: translateY(0px);
  }
  `}

  ${({ isSmallComboCard }) =>
    isSmallComboCard &&
    css`
      margin: 0;
    `}
`;

export const PRODUCT_CARD_IMAGE_DIMENSIONS = {
  MOBILE: {
    width: 400,
    bannerProductWidth: 650,
    modified: {
      width: 500,
    },
  },
  DESKTOP: {
    height: 320,
    modified: {
      width: 460,
      height: 344,
    },
  },
};

export const TourTitleWrapper = styled.h2<{
  isPopup?: boolean;
  pageType?: string;
  isNonPoi?: boolean;
}>`
  ${expandFontToken(FONTS.HEADING_LARGE)}
  margin: 0;
  max-width: 768px;
  ${({ isNonPoi }) => isNonPoi && `margin-top: -1.5rem; margin-bottom: 1rem;`}

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
  }
`;

export const TitleWrapper = styled.div<{
  hasBorderedTitle?: boolean;
  $isTicketCard?: boolean;
  $isExperimentalCard?: boolean;
  $isDrawer?: boolean;
}>`
  grid-area: title;

  ${({ hasBorderedTitle }) =>
    hasBorderedTitle
      ? `
            border-bottom: 1px solid ${COLORS.GRAY.G6};
            @media(max-width: 768px) {
              border: none;
            }
          `
      : ''}

  ${({ $isTicketCard, $isExperimentalCard, $isDrawer }) =>
    !$isTicketCard &&
    `
    @media(max-width: 768px) {
      margin-top: -0.5rem;
      margin-bottom: -1rem;
      ${$isExperimentalCard && !$isDrawer && 'margin-top: -8px'} !important;
    }
  `}
`;

export const cardImageStyles = css`
  .card-img {
    grid-area: card-img;
    width: 288px;
    height: 344px;
    border-radius: 0.5rem;
    position: relative;

    img {
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      grid-row-end: initial;
      grid-column: span 2;
      aspect-ratio: 21/9;
      width: calc(100% + 2rem);
      height: 11.25rem;
      max-height: 11.25rem;
      margin: -1.375rem -1rem -0.5rem;
      border-radius: 0.5rem 0.5rem 0 0;

      img {
        border-radius: 0.5rem 0.5rem 0 0;
        background-color: rgba(0, 0, 0, 0.3);
        margin: 0;
      }
    }
  }
`;

export const ctaBlockMobileStyles = (isSticky: boolean) => css`
  grid-column: 1;
  width: ${isSticky ? '100%' : 'auto'};
`;

export const ProductHeader = styled.div`
  display: grid;
  grid-gap: 16px;
  display: contents;
`;

export const ProductBody = styled.div<{
  hasReadMore?: boolean;
  maxHeight?: number;
  defaultOpen?: boolean;
  collapsed?: boolean;
}>`
  grid-area: body;
  display: grid;
  grid-row-gap: 8px;
  overflow-anchor: none;
  .tour-description {
    cursor: ${({ hasReadMore }) => (hasReadMore ? 'pointer' : '')};
    ${expandFontToken('Paragraph/Medium')}
    p {
      margin: 0;
    }
    color: ${COLORS.GRAY.G2};
    display: grid;
    grid-gap: 0;
    ${({ collapsed, defaultOpen, maxHeight }) =>
      collapsed && !defaultOpen
        ? `
        max-height: ${maxHeight || 265}px;
        overflow: hidden;
      `
        : ''}
    ul {
      margin: 0;
      padding: 0;
      padding-left: 1rem;
      display: grid;
      list-style-type: none;

      li {
        position: relative;
      }

      li::before {
        content: '•';
        position: absolute;
        left: -0.8rem;
        color: currentColor;
      }
    }
  }
  ul:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    position: relative;

    .show-more-information {
      p:nth-child(1) {
        display: block;
      }
      ul {
        li:nth-child(n + 2) {
          display: list-item;
        }
      }
    }
    .tour-description {
      ${expandFontToken('Paragraph/Medium')}

      h6 {
        ${expandFontToken('Heading/Small')}
        margin: 16px 0;
        margin-top: 32px;
      }

      h6:first-child {
        margin-top: 0;
      }
      padding-bottom: 0.5rem;
    }
    ${({ collapsed, defaultOpen }) =>
      collapsed && !defaultOpen
        ? `
        .tour-description {
          display: none;
        }
    `
        : ''}
  }
  .display-none {
    display: none;
  }
  .display-expand {
    display: grid;
  }
`;

export const MoreDetailsBtnWrapper = styled.div`
  width: 100%;
  grid-area: cta-block;
  margin-top: -1rem;
`;

export const CTAContainer = styled.div<{ pageType?: any }>`
  grid-area: cta-combo;
  display: grid;
  grid-gap: 16px;
  align-content: start;
  @media (max-width: 768px) {
    display: contents;
  }
`;

export const CTABlock = styled.div<{
  isTicketCard?: boolean;
  isSticky: boolean;
  shouldOffset?: boolean;
}>`
  a {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    grid-area: ${({ isSticky }) => (isSticky ? 'cta-block' : 'body')};

    ${({ isSticky, shouldOffset }) =>
      isSticky &&
      `
        position: sticky;
        bottom: 0;
        transform: translateX(-1rem);
        bottom: env(safe-area-inset-bottom);
        ${shouldOffset ? 'transform: translateY(2rem);' : ''}
        background: ${COLORS.BRAND.WHITE};
        z-index: 2;
        padding: 1rem;
        box-shadow: 0px -2px 12px 0px rgba(84, 84, 84, 0.10);
      `}

    ${({ isSticky }) => ctaBlockMobileStyles(isSticky)}
  }
  @media (max-width: 370px) {
    width: 100%;
  }
`;

export const PriceContainer = styled.div<{
  $hasScratchPrice?: boolean;
  $isExperimentalCard?: boolean;
  pageType?: string;
  $isDrawer?: boolean;
}>`
  justify-self: center;
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  grid-column-gap: 8px;
  justify-items: left;
  grid-row-gap: 4px;
  justify-self: left;

  .tour-scratch-price {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;
    grid-column-gap: 4px;
    ${expandFontToken('UI/Label Small')}
  }

  .tour-price {
    display: flex;
    flex-direction: column;
    ${expandFontToken('Heading/Large')}

    .prefix {
      color: ${COLORS.GRAY.G3};
      ${expandFontToken('UI/Label Small')}
    }
  }

  @media (max-width: 768px) {
    grid-area: price-block;
    margin-bottom: ${({ $isExperimentalCard, $isDrawer }) =>
      $isExperimentalCard ? ($isDrawer ? '0.25rem' : '0') : '0.25rem'};
    ${({ $isDrawer }) => $isDrawer && 'margin-top: 0.25rem;'}
    ${({ theme }) => theme.productCards.priceFontSettings.mobile}

    .styled-price-block {
      grid-column-gap: 0.25rem;
    }

    .tour-price-container .tour-price {
      margin-right: 0;
    }

    .tour-scratch-price {
      ${expandFontToken(FONTS.SUBHEADING_SMALL)};
    }

    .savedtag-block {
      ${expandFontToken(FONTS.MISC_TAG_REGULAR)};
    }
  }
`;

interface IStyledProductCard {
  isTicketCard: boolean;
  isMobile: boolean;
  isV3Design?: boolean;
  layout?: any;
  isNewMediaSite?: boolean;
  isContentExpanded?: boolean;
  collapsed?: boolean;
  defaultOpen?: boolean;
  $isBannerCard?: boolean;
  $isSwipeSheetOpen?: boolean;
  $isModifiedProductCard?: boolean;
  $isAsideBarOverlay?: boolean;
  $isPoiMwebCard?: boolean;
  $showScratchPrice?: boolean;
  $isExperimentalCard?: boolean;
  $isDrawer?: boolean;
  $hasDiscount?: boolean;
  $isClicked?: boolean;
}

const modifiedProductCardStyles = css`
  grid-row-gap: 0.5rem;
  grid-template-rows: auto auto 1fr;
  max-height: max-content;
  position: relative;

  .card-img {
    width: 18rem;
    min-height: 21.5rem;
    max-height: 23rem;
    height: 100%;
  }

  ${TitleWrapper} {
    margin-bottom: 0.5rem;
  }

  ${ProductBody} {
    align-self: stretch;
  }
`;

export const CategoryIcon = styled.div<{
  $svgUrl: string;
}>`
  flex-shrink: 1;
  mask: ${({ $svgUrl }) => `url("${$svgUrl}") no-repeat center / contain`};
  height: 0.875rem;
  width: 0.875rem;
  mask-position: center;
  transition: all 0.3s;
  background: ${COLORS.BLACK};
`;

export const StyledCategoryContainer = styled.div<{
  $background: string;
}>`
  grid-area: category;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;

  ${CategoryIcon} {
    background: ${({ $background }) => $background};
  }

  span {
    background: ${({ $background }) => $background};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    font-family: ${HALYARD.FONT_STACK};
    text-transform: uppercase;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (min-width: 768px) {
    span {
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
    }

    ${CategoryIcon} {
      height: 0.9375rem;
      width: 0.9375rem;
    }
  }
`;

export const CategoryAndRatingContainer = styled.div<{
  $isExperimentalCard?: boolean;
  $isDrawer?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  ${({ $isDrawer }) =>
    !$isDrawer ? `margin-bottom: -0.25rem;` : `margin-bottom: -0.75rem;`}
  ${({ $isExperimentalCard, $isDrawer }) =>
    $isExperimentalCard && !$isDrawer && `margin-top: 0.25rem;`}

  @media (min-width: 768px) {
    justify-content: flex-start;
    gap: 1rem;

    ${StyledCategoryContainer} {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        height: 0.25rem;
        width: 0.25rem;
        background-color: ${COLORS.GRAY.G5};
        border-radius: 50px;
        right: -0.5rem;
        transform: translate(50%, 25%);
      }
    }
  }
`;

const asideBarStyles = css`
  max-height: none;
  padding: 1.25rem;
  border: none;
  display: flex;
  flex-direction: column;
  grid-row-gap: 1rem;
  border-radius: 0;

  .card-img {
    width: 28.75rem;
    height: auto;
    max-height: none;
    aspect-ratio: 16/10;
  }

  ${ProductHeader} {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 0.75rem;
    width: 100%;

    ${CategoryAndRatingContainer} {
      margin-bottom: 0.25rem;
    }

    ${NextAvailableBlock} {
      margin-top: 0.5rem;

      // text type not given on figma
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1rem;
      text-align: left;

      text-transform: uppercase;
    }

    ${TourTags} {
      margin-top: 1rem;
      gap: 0.75rem;

      .tour-tag {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
        color: ${COLORS.GRAY.G2};
        grid-column-gap: 0.25rem;

        ${CancellationPolicyHoverCard} {
          top: 80%;
        }

        &:not(:last-child) {
          margin: 0;

          &::after {
            content: '';
            position: relative;
            height: 0.25rem;
            width: 0.25rem;
            background-color: ${COLORS.GRAY.G5};
            margin-left: 0.4rem;
            border-radius: 50%;
            transform: translateY(2px);
          }
        }
      }
    }

    ${CTAContainer} {
      position: fixed;
      bottom: 0;
      background-color: white;
      box-shadow: 0px -2px 12px 0px #5454541a;
      position: fixed;
      bottom: 0;
      right: 0;
      padding: 0.75rem 1.5rem;
      width: 28.25rem;
      z-index: 10;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      ${PriceContainer} {
        .tour-price {
          ${expandFontToken(FONTS.HEADING_REGULAR)}
        }
      }
    }
  }

  ${ProductBody} {
    padding-bottom: 8rem;
  }
`;

const modifiedProductCardMwebCss = css<{
  isContentExpanded?: boolean;
  $isExperimentalCard?: boolean;
  $isDrawer?: boolean;
  $hasDiscount?: boolean;
}>`
  grid-row-gap: ${({ $isDrawer }) => ($isDrawer ? '0.8rem' : '1rem')};
  padding: ${({ $isDrawer }) => ($isDrawer ? '1rem 16px 0 16px' : '0.75rem')};
  overflow: hidden;
  position: relative;

  .card-img {
    height: initial;
    max-height: initial;
    aspect-ratio: 16/10;
    margin: -0.75rem -1rem -0.5rem;
  }

  ${TitleWrapper} {
    margin-top: -0.25rem;
    margin-bottom: -1.25rem;
    ${TourTitleWrapper} {
      color: ${COLORS.GRAY.G1};
      font-family: ${HALYARD.FONT_STACK};
      font-size: 1.125rem;
      font-style: normal;
      line-height: 1.5rem;
      letter-spacing: 0;
      font-weight: 500;
    }
  }

  ${MoreDetailsBtnWrapper} {
    button {
      font-family: ${HALYARD.FONT_STACK};
      letter-spacing: 0;
    }
  }

  ${TourTags} {
    margin: 1rem 0 -0.25rem;
    column-gap: 0.375rem;
    row-gap: 0.5rem;

    .tour-tag {
      flex-grow: 0;
      max-width: max-content;
      grid-column-gap: 0;
      font-family: ${HALYARD.FONT_STACK};
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 300;
      line-height: 1rem;

      &:not(:last-child) {
        margin: 0;

        &::after {
          content: '';
          position: relative;
          height: 0.25rem;
          width: 0.25rem;
          background-color: ${COLORS.GRAY.G5};
          margin-left: 0.375rem;
          border-radius: 0.625rem;
          transform: translateY(0.125rem);
        }
      }
    }
  }

  ${StyledPriceBlock} {
    grid-row-gap: 0;

    .tour-scratch-price {
      color: ${COLORS.GRAY.G3};
      ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
    }

    .strike-through {
      margin-right: 0.375rem;
      font-family: ${HALYARD.FONT_STACK};
      letter-spacing: 0;
      color: ${COLORS.GRAY.G3};
    }

    .tour-price-container {
      gap: 0;

      .tour-price {
        .strike-through {
          font-size: 1.125rem;
          font-style: normal;
          font-weight: 500;
          line-height: 1.5rem;
          letter-spacing: 0;
          color: ${({ $hasDiscount }) =>
            $hasDiscount ? COLORS.OKAY_GREEN.DARK_TONE : COLORS.GRAY.G2};
        }
      }

      ${SavedTag} {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)};
        font-family: ${HALYARD.FONT_STACK};
        padding: 0.125rem 0.375rem;
        color: ${COLORS.BRAND.WHITE};
        background-color: ${COLORS.OKAY_GREEN[3]};
        border-radius: 0.25rem;
      }
    }
  }

  ${CTAContainer} {
    ${NextAvailableBlock} .available-text {
      margin-top: 1rem;
      color: ${COLORS.TEXT.BEACH};
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    }

    ${PriceContainer} {
      ${({ isContentExpanded, $isExperimentalCard }) =>
        !isContentExpanded &&
        !$isExperimentalCard &&
        css`
          margin-bottom: -0.25rem;
        `}
    }

    ${CTABlock} {
      margin-bottom: 0.5rem;
      grid-column: 1/3;

      button {
        font-family: ${HALYARD.FONT_STACK};
        letter-spacing: 0;
      }
    }
  }
`;

export const StyledProductCard = styled.div<IStyledProductCard>`
  ${({ collapsed, defaultOpen, isMobile }) =>
    collapsed && !defaultOpen && !isMobile
      ? `
        max-height: 344px;
        overflow: hidden;
      `
      : ''}
  background-color: ${({ isV3Design }) =>
    isV3Design ? 'transparent' : COLORS.BRAND.WHITE};
  padding: ${({ isTicketCard, theme }) =>
    isTicketCard ? `24px 0px 24px 40px` : theme.productCards.padding.desktop};
  ${({ isTicketCard, theme, isMobile, isV3Design, $isDrawer }) =>
    (!isTicketCard || isMobile) &&
    !isV3Design &&
    !$isDrawer &&
    `border: ${theme.productCards.border};
    border-radius: 4px;`};
  display: grid;

  grid-row-gap: 24px;
  grid-template-columns: 1fr auto;
  grid-template-areas: ${({ layout }) =>
    layout.desktop.map((row: any) => `'${row}'`)};
  ${StlyedSplit} {
    margin: 0;
    max-width: unset;
    padding: 0;
  }
  ${HorizontalLine} {
    grid-area: line;

    ${({ theme }) => theme.productCards.lineStyles || ''};
    margin: 0;
  }

  .more-details {
    ${expandFontToken('Button/Medium')}
    color: ${COLORS.TEXT.CANDY_1};
    z-index: 1;
    width: calc(100% - 36.6rem);
    position: absolute;
    bottom: 1px;
    padding-bottom: 1.5rem;
    ${({ isContentExpanded }) =>
      !isContentExpanded &&
      `background: linear-gradient(182deg, rgba(255, 255, 255, 0.2) 3%, rgba(255, 255, 255, 0.88) 48.92%, #FFF 70%);
      height: 15%;`};
    cursor: pointer;
    outline: none;
    display: grid;
    grid-auto-flow: column;
    align-items: flex-end;
    justify-content: start;
    grid-gap: 8px;

    .chevron {
      top: 0.15rem;
      svg {
        path {
          stroke: ${COLORS.TEXT.CANDY_1};
        }
      }
    }
    @media (max-width: 768px) {
      justify-content: left;
    }
  }
  ${({ theme }) => theme.productCards?.styles?.desktop}

  ${({ isTicketCard }) => (isTicketCard ? null : cardImageStyles)}

  grid-template-rows: min-content min-content min-content;
  grid-template-columns: ${({ isTicketCard }) =>
    isTicketCard ? `30fr 1fr auto` : `auto 1fr auto`};
  grid-auto-rows: min-content;
  column-gap: 1.5rem;

  .card-img {
    border-radius: 0;
  }

  ${({ $isModifiedProductCard, $isAsideBarOverlay }) => {
    if ($isModifiedProductCard)
      return $isAsideBarOverlay ? asideBarStyles : modifiedProductCardStyles;
    return null;
  }}

  @media (min-width: 768px) {
    ${TourTags} {
      margin-top: 0;
    }
  }
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.productCards.padding.mobile};
    margin: 0
      ${({ theme: { theme }, isTicketCard, $isDrawer }) =>
        getMargin({ theme, isTicketCard, $isDrawer })};

    grid-template-areas: ${({ layout }) =>
      layout.mobile.map((row: any) => `'${row}'`)};

    grid-template-areas: ${({ layout, $isExperimentalCard }) =>
      $isExperimentalCard
        ? layout.mobile
            .filter((row: any) => !['body', 'cta-block'].includes(row))
            .map((row: any) => `'${row}'`)
        : layout.mobile.map((row: any) => `'${row}'`)};

    width: auto;
    grid-template-columns: 1fr;

    ${({ theme }) => theme.productCards?.styles?.mobile}

    .more-details {
      margin-left: 0;
      margin-bottom: 0;
      ${({ isTicketCard }) =>
        isTicketCard &&
        `
        padding: 0.75rem;
        background-color: ${COLORS.GRAY.G7};
        margin-top: 0;
        grid-area: cta-block;
        grid-column: 1 / 2;
        width: 32vw;
        border-radius: 4px;
        color: ${COLORS.GRAY.G2};
        position: absolute;
        ${expandFontToken('Button/Medium')}
        display: flex;
        justify-content: center;
        line-height: 125%;
        .chevron {
          display: none;
        }
      `}
    }

    .card-img {
      width: calc(100% + 2rem);
      height: auto;
      max-height: none;
      aspect-ratio: 16/10;

      img {
        border-radius: 0;
      }
    }

    .card-img img {
      width: 100%;
    }

    ${({ $isPoiMwebCard }) => $isPoiMwebCard && modifiedProductCardMwebCss}

    ${({ $isBannerCard }) =>
      $isBannerCard &&
      css`
        .card-img {
          aspect-ratio: 16/12;

          .video-container,
          img {
            width: 100%;
          }
        }
      `}
  }
`;

export const BoosterTag = styled.div`
  font-size: 11px;
  font-weight: 600;
  line-height: 13px;
  color: ${COLORS.TEXT.CANDY_1};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: ${COLORS.BRAND.WHITE};
  border-radius: 2px;
  margin-bottom: 7px;
  padding: 2px 4px;
  display: inline-block;

  @media (max-width: 768px) {
    position: absolute;
    margin-top: -2.125rem;
    padding: 5px;
    border-radius: 4px;
  }
`;

export const NextAvailableBlockSkeletonWrapper = styled.div`
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: start;
  height: 1rem;

  @media (max-width: 768px) {
    grid-area: next-available;
    margin-top: -1rem;
  }
`;

export const ProductOfferBlock = styled.div`
  grid-area: offer;
  font-size: 14px;
  line-height: 15px;
  font-family: ${HALYARD.FONT_STACK};
  font-weight: 400;
  cursor: pointer;
  color: ${({ theme: { primaryAccent } }) =>
    primaryAccent ? primaryAccent : COLORS.BRAND.PURPS};
  p {
    margin: 0;
    color: ${({ theme: { primaryAccent } }) =>
      primaryAccent ? primaryAccent : COLORS.BRAND.PURPS};
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
export const V1BoosterBlock = styled.div<{ boosterHasIcon?: boolean }>`
  grid-area: booster;
  font-family: ${HALYARD.FONT_STACK};
  font-weight: 400;
  font-size: 15px;
  line-height: 21px;
  text-align: left;
  color: ${COLORS.GRAY.G3};
  font-size: 1em;
  display: inline-block;
  p {
    margin: 0;
    color: ${COLORS.GRAY.G3};
    font-size: 15px;
    strong {
      font-weight: unset;
    }
  }
  br {
    display: none;
  }
  .block-img img {
    display: none;
  }
  @media (max-width: 768px) {
    br {
      display: initial;
    }
    .block-img img {
      width: 100%;
      display: inline;
    }
    p {
      font-size: 12px;
      strong {
        font-weight: 500;
        line-height: 1.5;
      }
    }
    font-size: 0.8em;
    display: grid;
    grid-template-columns: ${(props) => (props.boosterHasIcon ? '40px' : '')} auto;
    grid-gap: 10px;
    align-items: center;
    margin: 0;
  }
`;

export const StyledRatingsContainer = styled.div<{ $isSafari?: boolean }>`
  grid-area: rating;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.125rem;

  svg {
    height: 0.75rem;
    width: 0.75rem;
    margin-top: ${({ $isSafari }) => ($isSafari ? '0' : '1px')};
  }

  span {
    color: ${COLORS.TEXT.CANDY_1};

    &.avg-rating {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
      font-family: ${HALYARD.FONT_STACK};
    }

    &.rating-count {
      font-family: ${HALYARD.FONT_STACK};
      font-size: 0.75rem;
      font-weight: 300;
      line-height: 0.9375rem;
      letter-spacing: 0em;
      text-align: left;
    }
  }

  @media (min-width: 768px) {
    gap: 0.25rem;

    span {
      &.avg-rating {
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
      }

      &.rating-count {
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
        margin-top: 1px;
      }
    }
  }
`;

export const ModalCardContainer = styled.div`
  @media (max-width: 768px) {
    background: #fff;
    border-radius: 0.75rem 0.75rem 0 0;

    ${StyledProductCard} {
      margin: 0;
      border: none;
      padding: 1.5rem 1rem 3rem;

      ${StyledCategoryContainer} {
        margin-top: 0.5rem;
      }

      ${StyledRatingsContainer} {
        margin-top: 0.5rem;
      }

      ${CTABlock} {
        margin-bottom: 0;
        position: fixed;
        width: calc(100vw - 2rem);
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .card-img {
      width: calc(100% + 2.5rem);
      margin: -1.5rem -1.5rem -0.5rem;
      max-height: none;
      height: auto;
      aspect-ratio: 16/10;
    }

    ${TitleWrapper} {
      max-width: calc(100% - 24px);
    }
    ${ProductBody} {
      .tour-description {
        width: 100%;
        display: block;
        p {
          margin-bottom: 12px;
        }
        li,
        p {
          font-size: 15px;
          line-height: 23px;
        }
      }
      .more-details {
        display: none;
      }
      ${MoreDetailsBtnWrapper} {
        display: none;
      }
    }
  }
`;

export const OpenDatedDescriptor = styled.div`
  margin: 1.25rem 0 -0.25rem;
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};

  @media (max-width: 768px) {
    grid-area: open-dated-descriptor;
    margin: 0.5rem 0 -1rem;
    ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  }
`;

export const ButtonContainer = styled.div<{
  $isInSidePanel?: boolean;
  $isExperimentalCard?: boolean;
}>`
  margin: auto;
  min-width: ${({ $isExperimentalCard }) =>
    $isExperimentalCard ? '11.375rem' : `14.375rem`};
  width: 100%;

  height: 2.75rem;
  button {
    border: none;
    white-space: nowrap;
  }
`;

export const HighlightTabsWrapper = styled.div<{
  hasRegularHighlights: boolean;
}>`
  display: grid;
  grid-row-gap: 1rem;
  margin-top: ${({ hasRegularHighlights }) =>
    hasRegularHighlights ? '1rem' : 0};
`;

export const TabsWrapper = styled.div`
  display: block;
  ${expandFontToken('Paragraph/Large')}
  border-bottom: 0.0625rem solid ${COLORS.GRAY.G6};
  justify-content: left;
  position: relative;
  overflow: hidden;
  margin-top: -0.5rem;
  padding-top: 0.5rem;

  .swiper-slide {
    width: auto;
  }
`;

export const SwiperControls = styled.div`
  display: flex;
  align-items: center;
  .prev-slide,
  .next-slide {
    position: absolute;
    pointer-events: none;
    cursor: pointer;
    z-index: 2;
    height: 2rem;
    svg {
      fill: ${COLORS.BRAND.WHITE};
      background: linear-gradient(
        180deg,
        ${COLORS.BRAND.WHITE} 25%,
        rgba(255, 255, 255, 0) 100%
      );
      background: -webkit-linear-gradient(
        180deg,
        ${COLORS.BRAND.WHITE} 25%,
        rgba(255, 255, 255, 0) 100%
      );
      circle {
        pointer-events: auto;
        box-shadow: 0 0 0.0625rem rgba(0, 0, 0, 0.1),
          0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
      }
    }
  }
  .prev-slide {
    left: 0;
    top: -0.2rem;
    svg {
      transform: scaleX(-1);
    }
  }
  .next-slide {
    right: 0;
    top: -0.2rem;
  }
`;

export const Tab = styled.div`
  cursor: pointer;
  padding-bottom: 0.5rem;
  display: block;
  width: auto;
  border-bottom: 0.0625rem solid transparent;
  transform: translateY(0.0625rem);
  ${expandFontToken('UI/Label Medium')}
  margin-right: 1.5rem;

  &.active {
    color: ${COLORS.TEXT.CANDY_1};
    border-color: ${COLORS.TEXT.CANDY_1};
    padding-bottom: 0.453125rem;
  }
`;

export const HeightAnimator = styled.div`
  transition: height 0.5s ease-in-out;
`;

export const TabPanel = styled.div<{ isActive: boolean; pageType: string }>`
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
  ${({ pageType }) =>
    pageType === CUSTOM_TYPES.GLOBAL_EXPERIENCE
      ? `
      li {
        color: #666666 !important;
      }`
      : ''}
`;

const openingAnimationDesktop = keyframes`
  from {
    margin: 0;
    padding: 0;
  }
  to {
    margin: 0 -0.75rem;
    padding-top: 3.625rem;
    padding-bottom: 0.75rem;
  }
`;

const openingAnimationMobile = keyframes`
  from {
    margin: 0 1.5rem;
  }
  to {
    margin: 0 0.75rem;
    padding: 6.875rem 0.75rem 0.75rem;
  }
`;

const shineDesktop = keyframes`
  100% {
    left: 110%;
  }
`;

const shineMobile = keyframes`
  100% {
    left: 130%;
  }
`;

export const SpecialProductWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #ecbf7e 0%,
    #e1b26e 26.56%,
    #e3bc83 61.98%,
    #f3dfc3 100%
  );
  animation: ${openingAnimationDesktop} 400ms cubic-bezier(0.7, 0, 0.3, 1)
    1600ms forwards;
  &::after {
    animation: ${shineDesktop} 1200ms cubic-bezier(0.7, 0, 0.3, 1) 2005ms;
    animation-fill-mode: forwards;
    content: '';
    position: absolute;
    top: -30%;
    left: -25.5%;
    width: 15rem;
    background-blend-mode: soft-light;
    height: 150%;
    transform: rotate(18deg);
    background: #fff;
    z-index: 20;
    opacity: 0.5;
    filter: blur(30px);
    background: linear-gradient(
      139deg,
      rgba(255, 255, 255, 0) 0%,
      #fff 50%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  @media (max-width: 768px) {
    animation: ${openingAnimationMobile} 400ms cubic-bezier(0.7, 0, 0.3, 1)
      1600ms forwards;
    margin: 0 1.5rem;
    &::after {
      left: -80%;
      width: 11.1875rem;
      animation: ${shineMobile} 1200ms cubic-bezier(0.7, 0, 0.3, 1) 2005ms;
    }
    ${StyledProductCard} {
      border: none;
      margin: 0 auto;
      .card-img {
        z-index: 10;
      }
    }
  }
`;

export const SpecialProductDetailLabelWrapper = styled.div`
  height: 1.25rem;
  gap: 0.375rem;
  display: flex;
  width: fit-content;
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .label-detail {
    color: #570101;
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    white-space: nowrap;
  }
  @media (max-width: 768px) {
    height: 1rem;
    svg {
      width: 1rem;
      height: 1rem;
    }
    .label-detail {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
      line-height: 1rem;
    }
  }
`;

export const SpecialProductDetailsWrapper = styled.div<{
  $isOpeningAnimationComplete: boolean;
}>`
  position: absolute;
  top: 1rem;
  width: calc(100% - 1.5rem);
  left: 0.75rem;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  padding: 0 1.5rem;
  box-sizing: border-box;
  .special-product-header-wrapper {
    display: flex;
    svg {
      width: 1.5rem;
      height: 1.875rem;
    }
    .special-product-header {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      color: #570101;
      margin-right: -0.125rem;
    }
  }
  .special-product-details-labels {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    .special-product-details-separator {
      height: 0.25rem;
      width: 0.25rem;
      border-radius: 50%;
      background-color: rgb(87 1 1 / 24%);
    }
    .swiper-wrapper {
      transition-timing-function: linear !important;
    }
    .swiper-slide {
      width: fit-content;
    }
  }
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    top: 1.25rem;
    padding: 0;
    &::after,
    &::before {
      content: '';
      position: absolute;
      width: 32px;
      height: 44px;
      bottom: 2px;
      z-index: 2;
      ${({ $isOpeningAnimationComplete }) =>
        !$isOpeningAnimationComplete &&
        `
          opacity: 0;
        `}
    }
    &::before {
      left: -1;
      background: linear-gradient(
        90deg,
        #e7ba77 0%,
        rgba(233, 187, 121, 0) 100%
      );
    }
    &::after {
      right: 0;
      background: linear-gradient(
        -90deg,
        #e7ba77 16.15%,
        rgba(233, 187, 121, 0) 100%
      );
    }
    .special-product-header-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      svg {
        width: 1.375rem;
        height: 1.75rem;
      }
      .special-product-header {
        margin-right: -0.0625rem;
        ${expandFontToken(FONTS.HEADING_SMALL)};
      }
    }
    .special-product-details-labels {
      padding: 0.84375rem 0 0.78125rem;
      transform: translateX(-50%);
      ${({ $isOpeningAnimationComplete }) =>
        !$isOpeningAnimationComplete &&
        `
          opacity: 0;
        `}
      .swiper-wrapper {
        align-items: center;
      }
    }
    .special-product-header-separator {
      width: 100%;
      max-width: 15.625rem;
      align-self: center;
      height: 0.0625rem;
      margin: 0.5rem 0 0.1875rem;
      background: linear-gradient(
        270deg,
        rgba(204, 150, 0, 0) 0%,
        #a4563b 32.81%,
        #a4563b 61.46%,
        rgba(204, 150, 0, 0) 100%
      );
    }
  }
`;

const ellipseAnimation1 = keyframes`
  0% {
    transform: translateY(-91px) translateX(468px);
    background-color: rgba(238, 221, 251, 0.8);
  }
  50% {
    transform: translateY(-110px) translateX(656px);
    background-color: rgba(228, 193, 255, 0.43);
  }
  100% {
    transform: translateY(-110px) translateX(656px);
    background-color: rgba(255, 216, 216, 0.47);
  }
`;

const ellipseAnimation2 = keyframes`
  0% {
    transform: translateY(221px) translateX(926px);
    background-color: rgba(254, 243, 233, 1);
  }
  50% {
    transform: translateY(231px) translateX(530px);
    background-color: rgba(254, 222, 189, 0.19);
  }
  100% {
    transform: translateY(231px) translateX(530px);
    background-color: rgba(238, 225, 254, 1);
  }
`;

const ellipseAnimation3 = keyframes`
  0% {
    transform: translateY(-90.5px) translateX(1030px);
    background-color: rgba(237, 218, 250, 1);
  }
  50% {
    transform: translateY(200px) translateX(1080px);
    background-color: rgba(255, 224, 192, 0.25);
  }
  100% {
    transform: translateY(200px) translateX(1080px);
    background-color: rgba(241, 214, 255, 1);
  }
`;

const ellipseAnimation4 = keyframes`
  0% {
    transform: translateY(24.5px) translateX(594px);
    background-color: rgba(238, 217, 255, 1);
  }
  50% {
    transform: translateY(-91px) translateX(172px);
    background-color: rgba(238, 217, 255, 0.5);
  }
  100% {
    transform: translateY(-91px) translateX(172px);
    background-color: rgba(255, 157, 124, 0.15);
  }
`;

const ellipseAnimation5 = keyframes`
  0% {
    transform: translateY(230.5px) translateX(314px);
    background-color: rgba(253, 240, 230, 1);
  }
  50% {
    transform: translateY(256px) translateX(375px);
    background-color: rgba(243, 233, 255, 0.78);
  }
  100% {
    transform: translateY(256px) translateX(375px);
    background-color: rgba(203, 151, 255, 0.2);
  }
`;

const ellipseAnimation6 = keyframes`
  0% {
    transform: translateY(-32.5px) translateX(-94px);
    background-color: rgba(255, 239, 223, 1);
  }
  50% {
    transform: translateY(-32.5px) translateX(-94px);
    background-color: rgba(255, 239, 223, 1);
  }
  100% {
    transform: translateY(-32.5px) translateX(-94px);
    background-color: rgba(255, 239, 223, 1);
  }
`;

const ellipseAnimation7 = keyframes`
  0% {
    transform: translateY(313.5px) translateX(-66px);
    background-color: rgba(255, 225, 181, 0.69);
  }
  100% {
    transform: translateY(165px) translateX(288px) rotate(90.04deg);
    background-color: rgba(225, 200, 254, 1);
  }
`;

const ellipseAnimation8 = keyframes`
  0% {
    transform: translateY(61px) translateX(203px);
    background-color: rgba(255, 233, 202, 0.97);
  }
  100% {
    transform: translateY(20px) translateX(-127px);
    background-color: rgba(255, 227, 233, 1);
  }
`;

const ellipseAnimation9 = keyframes`
  0% {
    transform: translateY(553px) translateX(132px);
    background-color: rgba(204, 153, 255, 0.47);
  }
  100% {
    transform: translateY(535px) translateX(132px) rotate(90.04deg);
    background-color: rgba(255, 234, 204, 0.68);
  }
`;

export const SpecialGuidedTourWrapper = styled.div`
  position: relative;
  display: flex;
  max-width: 78.5rem;
  border-radius: 1.5rem;
  overflow: hidden;
  gap: 1.25rem;
  background: linear-gradient(138deg, #fff3e3 19.51%, #f3e9ff 74.66%);
  padding: 1.5rem;
  margin: 0 auto;
  box-sizing: border-box;
  ${HorizontalLine} {
    max-height: 19rem;
  }
  ${StyledProductCard} {
    column-gap: 1rem;
    .card-img {
      margin-right: 0.5rem;
      min-height: calc(100% - 1.4375rem);
    }
  }
  .ellipse {
    position: absolute;
    left: 0;
    top: 0;
    width: 15.8125rem;
    height: 15.8125rem;
    border-radius: 50%;
    filter: blur(3.125rem);
  }
  @media (min-width: 768px) {
    align-items: center;
    .ellipse:nth-of-type(1) {
      animation: ${ellipseAnimation1} 7s linear 1ms infinite alternate both;
    }
    .ellipse:nth-of-type(2) {
      animation: ${ellipseAnimation2} 7s linear 1ms infinite alternate both;
    }
    .ellipse:nth-of-type(3) {
      animation: ${ellipseAnimation3} 7s linear 1ms infinite alternate both;
    }
    .ellipse:nth-of-type(4) {
      animation: ${ellipseAnimation4} 7s linear 1ms infinite alternate both;
    }
    .ellipse:nth-of-type(5) {
      animation: ${ellipseAnimation5} 7s linear 1ms infinite alternate both;
    }
    .ellipse:nth-of-type(6) {
      animation: ${ellipseAnimation6} 7s linear 1ms infinite alternate both;
    }
    ${StyledProductCard} {
      padding: 1.4375rem 1.4375rem 0;
      ${StyledPriceBlock} {
        max-width: 12.75rem;
        .tour-price-container {
          flex-wrap: wrap;
        }
      }
      ${CTAContainer} {
        grid-row-gap: 0.75rem;
      }
      ${ButtonContainer} {
        min-width: 12.75rem;
        height: 2.75rem;
      }
      .card-img {
        width: 14.75rem;
        height: 19rem;
        margin-bottom: 1.4375rem;
      }
    }
  }
  @media (max-width: 768px) {
    background: linear-gradient(138deg, #fff3e3 19.51%, #f3e9ff 74.66%);
    .ellipse:nth-of-type(1) {
      animation: ${ellipseAnimation7} 5s linear 1ms infinite alternate both;
    }
    .ellipse:nth-of-type(2) {
      animation: ${ellipseAnimation8} 5s linear 1ms infinite alternate both;
    }
    .ellipse:nth-of-type(3) {
      animation: ${ellipseAnimation9} 5s linear 1ms infinite alternate both;
    }
    flex-direction: column;
    border-radius: 0;
    gap: 1rem;
    padding: 1.25rem 0;
    ${StyledProductCard} {
      column-gap: 0;
      border: none;
      ${NextAvailableBlock} {
        margin-bottom: 0.25rem;
      }
    }
  }
`;

export const SpecialGuidedTourHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
  svg {
    width: 1.5rem;
    height: 1.875rem;
  }
  svg:last-of-type {
    transform: scale(-1, 1);
  }
  .special-product-header {
    ${expandFontToken(FONTS.HEADING_LARGE)};
    color: #306;
    margin-right: -0.075rem;
    white-space: nowrap;
  }
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    svg {
      width: 1.375rem;
      height: 1.75rem;
    }
    .special-product-header {
      margin-right: -0.1rem;
      ${expandFontToken(FONTS.HEADING_SMALL)};
    }
  }
`;

export const SpecialGuidedTourHeaderWrapper = styled.div`
  height: 290.85px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 16.875rem;
  z-index: 1;
  @media (max-width: 768px) {
    height: fit-content;
    margin: 0;
  }
`;

export const SpecialGuidedTourDetailsWrapper = styled.div`
  display: flex;
  gap: 0.325rem;
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

export const SpecialGuidedTourDetail = styled.div`
  width: 4.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  .icon-container {
    height: 1.25rem;
  }
  .detail-label {
    text-transform: uppercase;
    color: #306;
    text-align: center;
    ${expandFontToken(FONTS.MISC_BADGE_SMALL)}
  }
`;

export const SpecialGuidedTourDetailSeparator = styled.div`
  width: 0.25rem;
  height: 0.25rem;
  background: rgba(106, 28, 129, 0.5);
  border-radius: 50%;
  align-self: center;
`;

export const SpecialGuidedTourSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -0.5rem;
  gap: 1.25rem;
`;

export const GuidesBannerWrapper = styled.div<{ $isInSwipeSheet?: boolean }>`
  display: flex;
  gap: 0.5rem;
  height: 2rem;
  grid-area: guides-banner-wrapper;
  margin: ${({ $isInSwipeSheet }) => $isInSwipeSheet && '-1rem 0 -0.25rem'};
`;

export const GuidesImageWrapper = styled.div`
  display: flex;
  min-width: 5.5rem;
  img {
    min-width: 1.875rem;
    min-height: 1.875rem;
    border-radius: 2rem;
    border: 0.0625rem solid #e2e2e2;
    background-color: ${COLORS.GRAY.G7};
  }
  .push-left {
    margin-left: -0.25rem;
  }
  @media (max-width: 768px) {
    min-width: 4.5rem;
    .push-left {
      margin-left: -0.75rem;
    }
  }
`;

export const GuideBannerHeading = styled.div`
  max-width: 15rem;
  ${expandFontToken(FONTS.UI_LABEL_SMALL)}
`;

export const SpecialGuidedTourSummaryDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 0.875rem;
  position: relative;
  max-height: 16rem;
  &::before {
    content: '';
    position: absolute;
    width: 0.125rem;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 20px;
    background-color: ${COLORS.GRAY.G6};
  }
  .special-guided-tour-summary-content {
    .ending-line {
      white-space: nowrap;
    }
    display: flex;
    flex-direction: column;
    span {
      ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
    }
  }
`;

export const SpecialGuidedTourMoreDetailsCTA = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  cursor: pointer;
  svg {
    margin-top: 0.125rem;
  }
  span {
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    color:${COLORS.TEXT.CANDY_1};
  }
`;

export const SidePanel = styled.div<{ $closed: boolean }>`
  @keyframes sidePanelSlideInAnimation {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes sidePanelSlideOutAnimation {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
  position: fixed;
  right: 0;
  top: 3rem;
  z-index: 2147483640;
  height: calc(100vh - 8.25rem);
  width: 31.25rem;
  background-color: ${COLORS.BRAND.WHITE};
  padding: 0 1.5rem;
  box-sizing: border-box;
  overflow-x: none;
  overflow-y: scroll;
  animation: sidePanelSlideInAnimation 400ms cubic-bezier(0.7, 0, 0.3, 1)
    forwards;
  ${({ $closed }) =>
    $closed &&
    `animation: sidePanelSlideOutAnimation 400ms cubic-bezier(0.7, 0, 0.3, 1)
    forwards;`}
  ${NextAvailableBlock} {
    margin-top: 0.5rem;
  }
`;

export const SidePanelOverlay = styled.div<{ $closed: boolean }>`
  @keyframes overlayFadeInAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes overlayFadeOutAnimation {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 21474;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.35);
  animation: overlayFadeInAnimation 400ms cubic-bezier(0.7, 0, 0.3, 1) forwards;
  ${({ $closed }) =>
    $closed &&
    `animation: overlayFadeOutAnimation 400ms cubic-bezier(0.7, 0, 0.3, 1)
    forwards;`}
`;

export const SidePanelImageContainer = styled.div`
  width: 28.25rem;
  height: 15.8125rem;
  position: relative;
  margin-bottom: 0.5rem;
`;

export const ProductDescriptorsWrapper = styled.div`
  max-width: 28.25rem;
  margin: 1rem 0 1.25rem;
  ${TourTags} {
    grid-template-rows: auto auto;
    grid-row-gap: 0.75rem;
  }
`;

export const GuidesLabelWrapper = styled.div`
  margin: 1rem 0 0;
`;

export const HighlightsWrapper = styled.div`
  margin-top: 1rem;
  max-width: 28.25rem;
  ${HighlightTabsWrapper} {
    gap: 0.5625rem;
    ul {
      margin-top: 0;
      padding-left: 1.5rem;
      list-style-type: square;
      li {
        ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
      }
    }
  }
  ${TabPanel} {
    p {
      margin: 0;
    }
  }
`;

export const BottomBar = styled.div<{ $closed: boolean }>`
  animation: sidePanelSlideInAnimation 400ms cubic-bezier(0.7, 0, 0.3, 1)
    forwards;
  ${({ $closed }) =>
    $closed &&
    `animation: sidePanelSlideOutAnimation 400ms cubic-bezier(0.7, 0, 0.3, 1)
    forwards;`}
  z-index: 2147483641;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  right: 0;
  position: fixed;
  width: 31.25rem;
  background-color: ${COLORS.BRAND.WHITE};
  padding: 1.25rem 1.5rem;
  box-sizing: border-box;
  box-shadow: 0px -2px 12px 0px rgba(84, 84, 84, 0.1);
  gap: 2.25rem;
  align-items: flex-end;
  ${StyledPriceBlock} {
    gap: 0;
    min-width: 8.75rem;
    .tour-scratch-price {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }
    .tour-price-container {
      max-width: 11.25rem;
      flex-wrap: wrap;
      column-gap: 0.5rem;
      row-gap: 0.3125rem;
      .tour-price {
        ${expandFontToken(FONTS.HEADING_LARGE)}
      }
    }
    ${SavedTag} {
      color: ${COLORS.TEXT.OKAY_GREEN_3};
      ${expandFontToken(FONTS.MISC_TAG_REGULAR)}
      font-size: 0.75rem;
      font-style: normal;
      font-weight: 500;
      line-height: 1rem;
      white-space: nowrap;
    }
  }
  ${ButtonContainer} {
    margin: 0;
  }
`;

export const AvailableTodayBoosterWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
  color: ${COLORS.TEXT.OKAY_GREEN_3};
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
  ${expandFontToken(FONTS.SUBHEADING_SMALL)}
`;

export const CloseIconWrapper = styled.div`
  position: absolute;
  top: 0.875rem;
  right: 1.5rem;
  height: 1.5rem;
  width: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: ${COLORS.GRAY.G3};
  border: 1px solid ${COLORS.GRAY.G5};
  box-sizing: border-box;
  cursor: pointer;
  svg {
    width: 0.75rem;
    height: 0.75rem;
    path {
      stroke: ${COLORS.BRAND.WHITE};
    }
  }
`;

export const ReviewCardWrapper = styled.div`
  padding: 0.625rem;
  display: flex;
  gap: 1rem;
  width: 15.625rem;
  height: 5rem;
  border-radius: 0.375rem;
  box-sizing: border-box;
  background-color: ${COLORS.BRAND.WHITE};
  justify-content: center;
  align-items: center;
  overflow: hidden;
  svg {
    min-width: 1.5rem;
  }
  ${GuideBannerHeading} {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    max-width: max-content;
    flex-grow: 1;
  }
  .review-label {
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    position: relative;
    margin: 0;
    margin-right: -1rem;
    padding-right: 1rem;
    color: ${COLORS.GRAY.G2};
    height: 3.75rem;
    max-height: 3.75rem;
    max-width: 11.875rem;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  @media (max-width: 768px) {
    border-radius: 0.5rem;
    gap: 0.75rem;
    width: 100%;
    height: 4rem;
    padding: 1rem 0.75rem;
    flex-direction: row-reverse;
    margin-top: -0.25rem;
    .review-label {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      max-width: calc(100% - 2.25rem);
      height: 2.3rem;
      max-height: 2.3rem;
    }
    svg {
      transform: scale(-1, 1);
    }
  }
`;

const topSlideAnimation = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
    transform-origin: bottom;
  }
  to {
    transform: scale(1.1);
    opacity: 0;
    transform-origin: bottom;
  }
`;

const bottomSlideAnimation = keyframes`
  from {
    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0),
      0 0 0.0625rem 0 rgba(0, 0, 0, 0);
    transform: scale(0.9) translateY(0.8rem);
  }
  to {
    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.1),
      0 0 0.0625rem 0 rgba(0, 0, 0, 0.1);
    transform: scale(1) translateY(0);
  }
`;

export const AnimationWrapper = styled.div`
  position: relative;
  width: 15.625rem;
  height: 5.4375rem;
  box-sizing: border-box;
  & > * {
    position: absolute;
    opacity: 0;
  }
  .top-slide {
    opacity: 1;
    z-index: 3;
    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.1),
      0 0 0.0625rem 0 rgba(0, 0, 0, 0.1);
    animation: ${topSlideAnimation} 200ms cubic-bezier(0.3, 0, 0.3, 1) 3s
      forwards;
  }
  .bottom-slide {
    opacity: 1;
    z-index: 2;
    animation: ${bottomSlideAnimation} 400ms cubic-bezier(0.3, 0, 0.3, 1) 3s
      forwards;
  }
  .place-holder {
    opacity: 1;
    z-index: 1;
    transform: scale(0.9) translateY(0.8rem);
  }
  @media (max-width: 768px) {
    width: calc(100% - 3rem);
    height: 4rem;
    margin: 0 1.5rem 0.3125rem;
  }
`;

export const AnimationHeader = styled.div`
  position: relative;
  ${expandFontToken(FONTS.MISC_OVERLINE_LARGE)}
  color: ${COLORS.TEXT.PEACHY_ORANGE_3};
  text-transform: uppercase;
  margin: 5.625rem 0 0.5rem;
  &::before,
  &::after {
    width: 1.75rem;
    height: 0.0625rem;
    position: absolute;
    transform: translateY(0.5rem);
    content: '';
  }
  &::before {
    left: -2rem;
    background: linear-gradient(
      -90deg,
      #a4563b -3.28%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  &::after {
    right: -2rem;
    background: linear-gradient(
      90deg,
      #a4563b -3.28%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  @media (max-width: 768px) {
    margin: 0.0625rem auto -0.4375rem;
  }
`;

export const LineMoreDetailsButton = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
  text-decoration-line: underline;
  color: ${COLORS.BRAND.PURPS};
  margin-top: -1rem;
  text-align: center;
  grid-area: cta-block;
`;

export const SidePanelStickyHeader = styled.div<{
  $fadeIn?: boolean;
  $fadeOut?: boolean;
  $closed?: boolean;
}>`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  width: 31.25rem;
  height: 3rem;
  padding: 0 1.5rem;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
  z-index: 2147483640;
  animation: sidePanelSlideInAnimation 400ms cubic-bezier(0.7, 0, 0.3, 1)
    forwards;
  ${({ $closed }) =>
    $closed &&
    `animation: sidePanelSlideOutAnimation 400ms cubic-bezier(0.7, 0, 0.3, 1)
    forwards;`}
  ${({ $fadeIn }) => $fadeIn && `z-index: 2147483644;`}
  .guided-tour-label {
    color: ${COLORS.GRAY.G5};
    ${expandFontToken(FONTS.MISC_BOOSTER)};
    text-transform: uppercase;
    opacity: 0;
    ${({ $fadeIn }) => $fadeIn && `animation: fadeIn 300ms ease-out forwards;`}
    ${({ $fadeOut }) =>
      $fadeOut && `animation: fadeOut 300ms ease-out forwards;`};
  }
  .tour-title {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.HEADING_XS)};
    width: 16.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0;
    ${({ $fadeIn }) => $fadeIn && `animation: fadeIn 300ms ease-out forwards;`}
    ${({ $fadeOut }) =>
      $fadeOut && `animation: fadeOut 300ms ease-out forwards;`}
  }
`;

export const TourAvailableInLanguages = styled.div<{
  $increaseTopMargin?: boolean;
}>`
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  color: ${COLORS.PURPS.DARK_TONE};
  max-width: calc(100% - 2rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  grid-area: tour-available-in-languages-area;
  margin-top: -0.5rem;
`;

export const CompactHighlightsWrapper = styled(HighlightTabsWrapper)`
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  grid-template-rows: auto 1fr auto;
`;

export const HighlightsPanel = styled.div<{
  $isOverlay?: boolean;
}>`
  max-height: 15rem;
  overflow: hidden;
  align-self: stretch;

  .content-crawl {
    display: none;
  }

  ${({ $isOverlay }) =>
    $isOverlay &&
    css`
      ::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, white, white 10%, transparent 50%);
        left: 0;
        bottom: 0;
        z-index: 0;
        pointer-events: none;
      }
    `}
`;

export const Heading = styled.h3`
  ${expandFontToken(FONTS.HEADING_SMALL)}
  margin: 0;
`;

export const ViewMoreButton = styled.button<{ $isOverlay?: boolean }>`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  color: ${COLORS.BRAND.CANDY};
  background: none;
  border: none;
  padding: 0;
  margin-left: 1rem;
  width: max-content;
  cursor: pointer;
  z-index: 0;

  svg {
    height: 0.675rem;
    stroke-width: 0.15rem;
  }

  ${({ $isOverlay }) =>
    $isOverlay &&
    css`
      position: absolute;
      bottom: 0;
    `}
`;

export const SCPCarouselContainer = styled.div`
  width: 14rem;
  height: 8.75rem;
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const SCPTitle = styled.h2`
  color: ${COLORS.BLACK};
  ${expandFontToken(FONTS.HEADING_XS)}
  margin: 0;
`;

export const SCPPriceContainer = styled.div<{
  $isScratchPriceEnabled?: boolean;
}>`
  ${StyledPriceBlock} {
    grid-row-gap: 0.125rem;

    .tour-scratch-price {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
      color: ${COLORS.GRAY.G3};

      .strike-through {
        ${expandFontToken(FONTS.UI_LABEL_SMALL)}
        color: ${COLORS.GRAY.G3};
      }
    }

    .tour-price-container {
      align-items: center;
      .tour-price {
        .strike-through {
          ${expandFontToken(FONTS.SUBHEADING_LARGE)}
        }
      }
    }

    ${SavedTag} {
      background-color: ${COLORS.OKAY_GREEN[3]};
      padding: 0.125rem 0.375rem 0.1875rem 0.375rem;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
      color: ${COLORS.BRAND.WHITE};
      border-radius: 0.25rem;
    }
  }
`;

export const SCPContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RiveContainer = styled.div<{
  $transform: string;
  $iconWidth: number;
}>`
  position: absolute;
  width: ${({ $iconWidth }) => `${$iconWidth / 16}rem`};
  height: ${({ $iconWidth }) => `${$iconWidth / 16}rem`};
  left: 0;
  top: 0;
  transform: ${({ $transform }) => $transform};
`;

export const BoosterText = styled.p<{
  $theme: string;
  $transform: string;
  $borderTheme: string;
  $iconHeight: number;
}>`
  background-color: ${({ $theme }) => $theme};
  position: relative;
  font-family: ${HALYARD.FONT_STACK};
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: ${COLORS.BRAND.WHITE};
  margin: 0;

  padding: 0.125rem 0.375rem 0.125rem 0.5rem;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: calc(100% + 0.25rem);
    width: calc(100% + 0.25rem);
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    z-index: -1;
    transform: translate(-0.125rem, -0.125rem);
    background: ${({ $borderTheme }) => $borderTheme};
  }

  svg {
    position: absolute;
    height: ${({ $iconHeight }) => `${pxToRem($iconHeight)}rem`};
    left: 0;
    top: 0;
    transform: ${({ $transform }) => $transform};
  }
`;

export const BoosterContainer = styled.div<{
  $mobileLeft: number;
  $isOverlay?: boolean;
}>`
  position: absolute;
  z-index: 1;
  box-shadow: 0px 0.125rem 0.75rem 0px #00000033;
  transform: rotate(-4deg);
  top: ${({ $isOverlay }) => ($isOverlay ? 4 : 0.75)}rem;
  left: ${({ $isOverlay }) => ($isOverlay ? 2 : 1.8)}rem;

  @media (max-width: 768px) {
    transform: rotate(0);
    left: ${({ $mobileLeft }) => `${pxToRem($mobileLeft)}rem`};
    ${({ $isOverlay }) =>
      $isOverlay &&
      css`
        top: 0.75rem;
        left: 2rem;
      `}
  }
`;

function getMargin({ theme, isTicketCard, $isDrawer }: any) {
  if ($isDrawer) {
    return '0';
  }

  switch (true) {
    case theme !== THEMES.MIN_BLUE && !isTicketCard:
      return '1.5rem';
    case isTicketCard:
      return '0';
    default:
      return '24px';
  }
}
