import styled, { css, keyframes } from 'styled-components';
import { ButtonContainer as PopupCloseButtonContainer } from 'components/Product/components/Popup/CloseButton/styles';
import HorizontalLine from 'components/slices/HorizontalLine';
import { CarouselContainer } from 'UI/MediaCarousel/styles';
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

export const TourTags = styled.div<{
  horizontal?: boolean;
  pageType?: string;
  $forceMobile?: boolean;
  $isClickable?: boolean;
}>`
  ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
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

  ${({ $isClickable }) =>
    $isClickable &&
    css`
      .clickable {
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
      }
      .tour-tag:has(span.clickable) {
        cursor: pointer;
      }
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

  ${({ $forceMobile }) => !$forceMobile && '@media (max-width: 768px) {'}
  grid-area: tags;
  align-items: start;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  margin-top: 0rem;
  margin-bottom: 0.5rem;
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
  ${({ $forceMobile }) => !$forceMobile && '}'}
`;

export const NextAvailableBlock = styled.div<{
  $isExperimentalCard?: boolean;
  $isDrawer?: boolean;
  forceMobileStyles?: boolean;
  isPopup?: boolean;
}>`
  ${({ theme }) => theme.productCards?.nextAvailable?.desktop};
  color: ${COLORS.GRAY.G3};

  ${({ forceMobileStyles, isPopup }) =>
    forceMobileStyles &&
    isPopup &&
    `
      margin-top: 1rem;
      margin-bottom: -1rem;
    `}
  ${({ forceMobileStyles, isPopup }) =>
    forceMobileStyles &&
    !isPopup &&
    `
      align-self: flex-end;
      margin-bottom: -0.75rem;
    `}

  ${({ forceMobileStyles, isPopup }) =>
    (!forceMobileStyles || isPopup) && `@media (max-width: 768px) {`}
  grid-area: next-available;
  margin-top: ${({ $isExperimentalCard, $isDrawer }) =>
    $isExperimentalCard ? ($isDrawer ? '-0.75rem' : '-0.65rem') : '-1rem'};
  ${({ forceMobileStyles, isPopup }) => (!forceMobileStyles || isPopup) && `}`}
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
  isSwiperCard?: boolean;
}>`
  display: ${({ isCardVisible }) => (isCardVisible ? 'block' : 'none')};
  background: 'transparent';
  max-width: 1200px;
  margin: auto;
  width: 100%;
  position: relative;

  ${({ isV3Design, indexPosition }) =>
    isV3Design &&
    css`
      border-top: 1px solid ${COLORS.GRAY.G4A};
      background-color: ${COLORS.GRAY.G8};
      min-height: 400px;

      .indicator-triangle::before {
        border-color: transparent transparent ${COLORS.GRAY.G4A};
        border-width: 12px;
        border-style: solid;
        content: '';
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
        content: '';
        position: absolute;
        top: -22px;
        left: ${25 * (((indexPosition + 4) % 4) + 1) - 14.5}%;
        transform: translateY(0px);
      }
    `}

  .combo-section-heading {
    ${expandFontToken(FONTS.HEADING_LARGE)}
  }
  ${({ isSmallComboCard }) =>
    isSmallComboCard &&
    css`
      margin: 0;
    `}
`;

export const CloseButtonContainer = styled.div`
  ${PopupCloseButtonContainer} {
    z-index: 100;
  }
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
  $isHOHORevamp?: boolean;
  $forceMobile?: boolean;
  $isTicketCard?: boolean;
}>`
  ${expandFontToken(FONTS.HEADING_LARGE)}
  margin: 0;
  max-width: 768px;
  ${({ isNonPoi }) => isNonPoi && `margin-top: -1.5rem; margin-bottom: 1rem;`}
  svg {
    margin: 0 0 -0.125rem 0.375rem;
    cursor: pointer;
  }
  ${({ $isHOHORevamp }) => $isHOHORevamp && hohoFont}

  @media (max-width: 768px) {
    ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};

    ${({ $isTicketCard }) => $isTicketCard && `margin: 10px 0px 14.4px;`}

    ${({ $isHOHORevamp }) =>
      $isHOHORevamp &&
      `font-size: 18px;
       line-height: 24px;
       -webkit-text-stroke: 0.1px ${COLORS.GRAY.G1};`}
  }

  && {
    ${({ $forceMobile }) =>
      $forceMobile &&
      `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
  }

  ${({ $forceMobile }) => !$forceMobile && '@media (max-width: 768px) {'}
  ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ $forceMobile }) => !$forceMobile && '}'}
`;

export const TitleWrapper = styled.div<{
  hasBorderedTitle?: boolean;
  $isTicketCard?: boolean;
  $isExperimentalCard?: boolean;
  $isDrawer?: boolean;
  $forceMobile?: boolean;
}>`
  grid-area: title;

  ${({ hasBorderedTitle, $forceMobile }) =>
    hasBorderedTitle
      ? `
        ${!$forceMobile && 'border-bottom: 1px solid ${COLORS.GRAY.G6};'}

        @media(max-width: 768px) {
          border: none !important;
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

export const cardImageStyles = ($forceMobile?: boolean) => css`
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

    ${!$forceMobile && '@media (max-width: 768px) {'}

    grid-row-end: initial;
    grid-column: span 2;
    aspect-ratio: 21/9;
    width: calc(100% + 2rem);
    height: 11.25rem;
    max-height: 11.25rem;
    margin: -0.75rem -1rem -0.5rem;
    border-radius: 0.5rem 0.5rem 0 0;

    img {
      border-radius: 0.5rem 0.5rem 0 0;
      background-color: rgba(0, 0, 0, 0.3);
      margin: 0;
    }
    ${!$forceMobile && '}'}
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
  defaultOpen?: boolean;
  collapsed?: boolean;
  $forceMobile?: boolean;
  $isPopup?: boolean;
  maxHeight?: number;
  $isV3Design?: boolean;
}>`
  grid-area: body;
  display: grid;
  grid-row-gap: 8px;
  overflow-anchor: none;
  ${({ $isV3Design }) => $isV3Design && 'margin-bottom: 8px;'}
  .tour-description {
    cursor: ${({ hasReadMore }) => (hasReadMore ? 'pointer' : '')};
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
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
    ${({ $isPopup }) =>
      $isPopup &&
      css`
        overflow: initial;
      `}   
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
  ${({ $forceMobile }) => !$forceMobile && '@media (max-width: 768px) {'}
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
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}

    h6 {
      ${expandFontToken(FONTS.HEADING_SMALL)}
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
  ${({ $forceMobile }) => !$forceMobile && '}'}
  .display-none {
    display: none;
  }
  .display-expand {
    display: grid;
  }
`;

export const MoreDetailsBtnWrapper = styled.div<{
  $forceMobile: boolean;
}>`
  width: ${({ $forceMobile }) =>
    $forceMobile ? `calc(100% + 1.5rem)` : `calc(100%)`};
  grid-area: cta-block;
  align-self: flex-end;
  @media (max-width: 768px) {
    width: calc(100%);
  }
`;

export const CTAContainer = styled.div<{
  pageType?: any;
  $forceMobile?: boolean;
}>`
  grid-area: cta-combo;
  display: grid;
  grid-gap: 16px;
  align-content: start;
  z-index: 9;
  ${({ $forceMobile }) => $forceMobile && 'display: contents;'}
  @media (max-width: 768px) {
    display: contents;
  }
`;

export const CTABlock = styled.div<{
  isTicketCard?: boolean;
  isSticky: boolean;
  shouldOffset?: boolean;
  $forceMobile?: boolean;
  isPoiMwebCard?: boolean;
}>`
  a {
    text-decoration: none;
  }

  ${({ $forceMobile }) => !$forceMobile && '@media (max-width: 768px) {'}
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
  ${({ $forceMobile }) => !$forceMobile && '}'}

  @media (max-width: 370px) {
    width: 100%;
  }
`;

export const PriceContainer = styled.div<{
  $hasScratchPrice?: boolean;
  $isExperimentalCard?: boolean;
  $forceMobile?: boolean;
  pageType?: string;
  $isDrawer?: boolean;
  $isPoiMwebCard?: boolean;
  $showNextAvailable?: boolean;
}>`
  justify-self: center;
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  grid-column-gap: 8px;
  justify-items: left;
  justify-self: left;
  grid-row-gap: 4px;

  .tour-scratch-price {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;

    grid-column-gap: 4px;
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
  }

  .tour-price {
    display: flex;
    flex-direction: column;
    ${expandFontToken(FONTS.HEADING_LARGE)}

    .prefix {
      color: ${COLORS.GRAY.G3};
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }
  }

  @media only screen and (max-width: 768px) {
    margin-top: ${({ $isPoiMwebCard, $showNextAvailable }) =>
      !$isPoiMwebCard && !$showNextAvailable ? '1.25rem' : '0'};
    padding-bottom: ${({ $isPoiMwebCard, $showNextAvailable }) =>
      !$isPoiMwebCard && !$showNextAvailable ? '0.25rem' : '0'};
  }

  ${({ $forceMobile }) => !$forceMobile && '@media (max-width: 768px) {'}
  align-self: flex-end;
  grid-area: price-block;
  margin-bottom: ${({ $isExperimentalCard, $isDrawer }) =>
    $isExperimentalCard ? ($isDrawer ? '0.25rem' : '0') : '0.25rem'};
  ${({ $isDrawer }) => $isDrawer && 'margin-top: 0.25rem;'}
  ${({ theme }) => theme.productCards.priceFontSettings.mobile}

    .styled-price-block {
    row-gap: 0;
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
  ${({ $forceMobile }) => !$forceMobile && '}'}
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
  $isPoiMwebCard?: boolean;
  $showScratchPrice?: boolean;
  $isPopup?: boolean;
  $isExperimentalCard?: boolean;
  $isDrawer?: boolean;
  $hasDiscount?: boolean;
  $isClicked?: boolean;
  $isNewVerticalsProductCard?: boolean;
  $isCruise?: boolean;
  $isModifiedPopup?: boolean;
  $isSwiperCard?: boolean;
  $hasItineraryData?: boolean;
  $forceMobile?: boolean;
  forcedMobilePopup?: boolean;
  $isAsideBarOverlay?: boolean;
}

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
  $isNonPOICardWithRatings?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  ${({ $isDrawer }) =>
    !$isDrawer ? `margin-bottom: -0.25rem;` : `margin-bottom: -0.75rem;`}
  ${({ $isExperimentalCard, $isDrawer }) =>
    $isExperimentalCard && !$isDrawer && `margin-top: 0.25rem;`};
  ${({ $isNonPOICardWithRatings }) =>
    $isNonPOICardWithRatings && `margin-bottom: 1rem;`};

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

export const SlideUpTitle = styled.h3<{ $maxWidth?: number }>`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  margin: 0;
  left: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.4s cubic-bezier(0.7, 0, 0.3, 1);
  max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth}px` : '100%')};
  height: min-content;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 3rem;
  text-overflow: ellipsis;
`;

export const SlideUpContainer = styled.div<{
  $isTitleVisible?: boolean;
}>`
  margin: 0 auto 0 0;
  position: relative;
  height: 48px;
  width: 100%;
  overflow: hidden;

  ${SlideUpTitle} {
    opacity: ${({ $isTitleVisible }) => ($isTitleVisible ? 1 : 0)};
    top: ${({ $isTitleVisible }) => ($isTitleVisible ? '50%' : '100%')};
  }
`;

const popupStyles = css`
  display: flex;
  flex-direction: column;
  grid-row-gap: 1rem;
  margin: 0;
  border: none;
  padding: 0 1.5rem 3rem !important;
  border-radius: 0;
  overflow: initial !important;
  position: relative;

  ::-webkit-scrollbar {
    width: 0;
    display: none;
    visibility: hidden;
  }

  ${ProductHeader} {
    display: flex;
    flex-direction: column;
    row-gap: 0;

    ${CategoryAndRatingContainer} {
      margin-bottom: 0.5rem;
    }

    ${TitleWrapper} {
      h2 {
        font-family: ${HALYARD.FONT_STACK};
        font-size: 1.3125rem;
        font-weight: 500;
        line-height: 1.75rem;
        letter-spacing: 0px;
        text-align: left;
      }
    }

    ${TourTags} {
      padding-top: 1.25rem;
      width: 38.75rem;
      row-gap: 1rem;
    }

    ${NextAvailableBlock} .available-text {
      color: ${COLORS.TEXT.BEACH};
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
      margin-top: 1.5rem;
    }
  }

  ${ProductBody} {
    padding-bottom: 3rem;

    .tour-description {
      max-height: none;
      h6 {
        ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
        margin: 2rem 0 1rem;

        &:first-child {
          margin-top: 0.5rem;
        }

        &.inclusions-heading {
          margin-top: 0;
          padding-top: 2rem;
          border-top: 1px solid ${COLORS.GRAY.G6};
        }
        &.sights-covered-heading {
          visibility: hidden;
          height: 0;
          margin: 0;
          padding: 0 !important;
        }

        &:not(:first-child) {
          padding-top: 2rem;
          border-top: 1px solid ${COLORS.GRAY.G6};
        }
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
    height: 15.8125rem;
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
      background-color: ${COLORS.BRAND.WHITE};
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

    .tour-description {
      padding-bottom: 0;
    }
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
  overflow: initial;
  position: relative;

  .card-img {
    height: initial;
    max-height: initial;
    aspect-ratio: 16/10;
    margin: -0.75rem -0.75rem -0.5rem;
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
`;

export const itineraryStyles = css`
  .card-img {
    display: flex;
    flex-direction: column;
    position: relative;
  }
`;

export const StyledProductCard = styled.div<IStyledProductCard>`
  height: ${({
    isTicketCard,
    isV3Design,
    isMobile,
    $isNewVerticalsProductCard,
    $isPopup,
  }) =>
    $isPopup ||
    $isNewVerticalsProductCard ||
    isTicketCard ||
    isV3Design ||
    isMobile
      ? 'max-content'
      : '344px'};
  ${({ collapsed, defaultOpen, isMobile, $isPopup }) =>
    collapsed && !defaultOpen && !isMobile && !$isPopup
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

  grid-template-columns: 1fr auto;
  grid-template-areas: ${({ layout }) =>
    layout.desktop.map((row: any) => `'${row}'`)};
  gap: 0.5rem 1.5rem;
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
    color: ${COLORS.BRAND.CANDY};
    z-index: 1;
    width: calc(100% - 36.6rem);
    position: absolute;
    bottom: 1px;
    padding-bottom: 1.5rem;
    ${({ isContentExpanded, isV3Design }) => {
      if (!isContentExpanded && !isV3Design) {
        return `
            background: linear-gradient(182deg, rgba(255, 255, 255, 0.2) 3%, rgba(255, 255, 255, 0.88) 48.92%, #FFF 70%);
            height: 15%;
          `;
      } else if (!isContentExpanded && isV3Design) {
        return `
            background: linear-gradient(182deg, rgba(255, 255, 255, 0.2) 3%, rgb(248, 248, 248) 48.92%, rgb(248, 248, 248) 70%);
            height: 15%;
          `;
      }
    }};
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

    &.arrow-right {
      .chevron {
        top: -0.4rem;
        left: -0.15rem;
        height: 0.75rem;
        width: 0.75rem;

        svg {
          height: 0.75rem;
          width: 0.75rem;
          transform: rotate(270deg);
        }
      }
    }
    @media (max-width: 768px) {
      justify-content: left;
    }
  }
  ${({ theme }) => theme.productCards?.styles?.desktop}

  ${({ isTicketCard, $forceMobile }) =>
    isTicketCard ? null : cardImageStyles($forceMobile)}
  ${({ $isNewVerticalsProductCard, $isCruise, $isModifiedPopup }) =>
    $isNewVerticalsProductCard &&
    css`
      &&& {
        ${newVerticalStyles}
        ${$isCruise && cruiseStyles}
        ${$isModifiedPopup && modifiedPopupStyles}
      }
    `}  
      ${({ $isModifiedPopup }) =>
    $isModifiedPopup &&
    css`
      &&& {
        ${modifiedPopupStyles}
      }
    `} 

  grid-template-rows: min-content min-content min-content;
  grid-template-columns: ${({ isTicketCard }) =>
    isTicketCard ? `30fr 1fr auto` : `auto 1fr auto`};
  grid-auto-rows: min-content;
  column-gap: 1.5rem;
  @media (max-width: 768px) {
    column-gap: 0;
  }

  .card-img {
    border-radius: 0;
  }

  ${({ $isModifiedProductCard, $isPopup, $isAsideBarOverlay }) => {
    if ($isPopup) return popupStyles;
    if ($isModifiedProductCard)
      return $isAsideBarOverlay ? asideBarStyles : modifiedProductCardStyles;
    return null;
  }}

  @media (min-width: 768px) {
    ${({ $hasItineraryData }) => $hasItineraryData && itineraryStyles}
    ${TourTags} {
      margin-top: 0;
    }
  }

  ${({ $forceMobile, forcedMobilePopup, $isPopup }) =>
    $forceMobile &&
    !forcedMobilePopup &&
    !$isPopup &&
    `
      height: 36rem;
      grid-auto-rows: 1fr;
    `}
  ${({ $forceMobile }) => !$forceMobile && '@media (max-width: 768px) {'}
    padding: ${({ theme }) => theme.productCards.padding.mobile};
  margin: 0
    ${({ theme: { theme }, isTicketCard, $isDrawer, $isSwiperCard }) =>
      getMargin({ theme, isTicketCard, $isDrawer, $isSwiperCard })};
  grid-template-areas: ${({ layout }) =>
    layout.mobile.map((row: any) => `'${row}'`)};
  grid-template-areas: ${({ layout, $isExperimentalCard, $isDrawer }) =>
    $isExperimentalCard
      ? layout.mobile
          .filter(
            (row: any) =>
              ![
                'body',
                'cta-block',
                ...($isDrawer ? ['price-block'] : []),
              ].includes(row)
          )
          .map((row: any) => `'${row}'`)
      : layout.mobile.map((row: any) => `'${row}'`)};
  width: auto;
  grid-template-columns: 1fr;

  grid-template-areas: ${({ layout, $isExperimentalCard }) =>
    $isExperimentalCard
      ? layout.mobile
          .filter((row: any) => !['body', 'cta-block'].includes(row))
          .map((row: any) => `'${row}'`)
      : layout.mobile.map((row: any) => `'${row}'`)};

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
          ${expandFontToken(FONTS.BUTTON_MEDIUM)}
          display: flex;
          justify-content: center;
          line-height: 125%;
          .chevron {
            display: none;
          }
        `}
  }

  .card-img {
    ${({ $isPoiMwebCard }) => $isPoiMwebCard && `width: calc(100% + 1.5rem);`}
    height: auto;
    max-height: none;
    aspect-ratio: 16/10;
    margin-bottom: 0;

    img {
      border-radius: 0;
    }
  }

  .card-img img {
    width: 100%;
  }

  grid-row-gap: ${({ $isDrawer }) => ($isDrawer ? '0.8rem' : '0.75rem')};
  padding: ${({ $isDrawer }) => ($isDrawer ? '1rem 16px 0 16px' : '0.75rem')};
  overflow: hidden;
  position: relative;
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
  ${CTAContainer} {
    ${NextAvailableBlock} .available-text {
      margin-top: ${({ $isPoiMwebCard }) => ($isPoiMwebCard ? '1rem' : '2rem')};
      color: ${COLORS.TEXT.BEACH} !important;
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
      margin-bottom: ${({ $isPoiMwebCard }) =>
        $isPoiMwebCard ? '-0.5rem' : '-0.25rem'};
      margin-top: ${({ $isPoiMwebCard }) =>
        $isPoiMwebCard ? '0' : '-0.25rem'};
      grid-column: 1/3;
      align-self: flex-end;
    }
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
  ${({ $forceMobile }) => !$forceMobile && '}'}

  &:hover, &:active {
    cursor: pointer;
  }

  .card-img {
    height: ${({
      isTicketCard,
      isV3Design,
      isMobile,
      $isNewVerticalsProductCard,
      $isPopup,
    }) =>
      $isPopup ||
      $isNewVerticalsProductCard ||
      isTicketCard ||
      isV3Design ||
      isMobile
        ? 'auto'
        : '344px'};
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

export const StyledRatingsContainer = styled.div<{
  $isSafari?: boolean;
  $isHarryPotterPage?: boolean;
}>`
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
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      font-family: ${HALYARD.FONT_STACK};
      text-align: left;

      & .underline {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  ${({ $isHarryPotterPage }) =>
    $isHarryPotterPage &&
    `&:hover {
      transition: ease-in-out 250ms;

      span {
        color: ${COLORS.CANDY.TERTIARY};
      }

      svg > path {
        fill: ${COLORS.CANDY.TERTIARY};
      }
    }`};

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

export const OpenDatedDescriptor = styled.div<{ forceMobile?: boolean }>`
  margin: 1.25rem 0 -0.25rem;
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};

  /* ${({ forceMobile }) => forceMobile && '@media (max-width: 768px) {'} */
  ${({ forceMobile }) => !forceMobile && '@media (max-width: 768px) {'}
  grid-area: open-dated-descriptor;
  margin: 0.5rem 0 -1rem;
  ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
  ${({ forceMobile }) => !forceMobile && '}'}
`;

export const ButtonContainer = styled.div<{
  $isInSidePanel?: boolean;
  $isExperimentalCard?: boolean;
}>`
  margin: auto;
  min-width: ${({ $isExperimentalCard }) =>
    $isExperimentalCard ? '11.375rem' : `14.375rem`};
  width: 100%;

  @media (max-width: 768px) {
    min-width: unset;
  }

  height: 2.75rem;
  button {
    border: none;
    white-space: nowrap;
  }
  @media (max-width: 768px) {
    // overriding aer style
    button {
      font-family: halyard-text, sans-serif;
      letter-spacing: 0;
    }
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
  ${expandFontToken(FONTS.PARAGRAPH_LARGE)}
  border-bottom: 0.0625rem solid ${COLORS.GRAY.G6};
  justify-content: left;
  position: relative;
  overflow: hidden;
  margin-top: -0.5rem;
  padding-top: 0.5rem;
  min-height: 30px;

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
  transform: translateY(0.0625rem);
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
  margin-right: 1.5rem;

  &.active {
    color: ${COLORS.TEXT.CANDY_1};
    border-bottom: 0.1825rem solid ${COLORS.TEXT.CANDY_1};
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
  z-index: 1000000;
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
    margin-bottom: 1rem;
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
  background-color: ${COLORS.BRAND.WHITE};
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
  $showPopup?: boolean;
  $isV3Design?: boolean;
}>`
  max-height: ${({ $isV3Design }) => ($isV3Design ? 16 : 15)}rem;
  overflow: hidden;
  align-self: stretch;

  .content-crawl {
    display: none;
  }

  ${({ $isOverlay, $showPopup, $isV3Design }) =>
    $isOverlay &&
    css`
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to top,
          ${$isV3Design ? COLORS.GRAY.G8 : 'white'},
          ${$isV3Design ? COLORS.GRAY.G8 : 'white'} ${$showPopup ? 16.5 : 10}%,
          transparent 50%
        );
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

export const ViewMoreButton = styled.button<{
  $isOverlay?: boolean;
  $showPopup?: boolean;
  $hasBackground?: boolean;
  $noMargin?: boolean;
  $isHarryPotterPage?: boolean;
}>`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  color: ${COLORS.TEXT.CANDY_1};
  background: none;
  border: none;
  padding: 0;
  margin-left: ${({ $noMargin }) => ($noMargin ? '0' : '1rem')};
  width: max-content;
  cursor: pointer;
  z-index: 0;

  svg {
    margin-left: 0.25rem;
  }

  ${({ $isHarryPotterPage }) =>
    $isHarryPotterPage &&
    `&:hover {
      color: ${COLORS.CANDY.TERTIARY};

      svg {
        transition: ease-in-out 250ms;
        transform: translateX(1px);
      }
    }`};

  ${({ $isOverlay }) =>
    $isOverlay &&
    css`
      position: absolute;
      bottom: 0;
    `}

  ${({ $hasBackground }) =>
    $hasBackground &&
    css`
      background: ${COLORS.BACKGROUND.FADED_CANDY};
      border-radius: 8px;
      width: Hug (258px) px;
      padding: 0.5rem 1rem;
    `}

  ${({ $showPopup }) =>
    $showPopup &&
    css`
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
      padding: 0.5rem 0.5rem 0.6rem 1rem;
      margin-left: 0;
      background: ${COLORS.BACKGROUND.FADED_CANDY};
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.7, 0, 0.3, 1);

      svg {
        margin-top: 1px;
        margin-left: 1px;
        height: 0.8rem;
        path {
          stroke: ${COLORS.BRAND.CANDY};
          stroke-width: 0.12rem;
        }
        transition: all 0.3s cubic-bezier(0.7, 0, 0.3, 1);
        transform: rotate(45deg);
      }

      &:hover {
        background: ${COLORS.CANDY.LIGHT_TONE_3};

        svg {
          transform: rotate(90deg);
        }
      }
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
  $textColor: string;
  $iconStyles: Record<string, number>;
}>`
  background-color: ${({ $theme }) => $theme};
  position: relative;
  font-family: ${HALYARD.FONT_STACK};
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: ${({ $textColor }) => $textColor};
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
    left: ${({ $iconStyles }) => `${$iconStyles.left}px`};
    top: ${({ $iconStyles }) => `${$iconStyles.top}px`};
    transform: ${({ $transform }) => $transform};
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const BoosterContainer = styled.div<{
  $mobileStyles: Record<string, number>;
  $isOverlay?: boolean;
  $rotateDeg: number;
  $boosterStyles: Record<string, number>;
}>`
  position: absolute;
  z-index: 1;
  box-shadow: 0px 0.125rem 0.75rem 0px #00000033;
  transform: rotate(${({ $rotateDeg }) => $rotateDeg}deg);
  top: ${({ $isOverlay, $boosterStyles }) =>
    $isOverlay ? 4 : $boosterStyles.top}rem;
  left: ${({ $isOverlay, $boosterStyles }) =>
    $isOverlay ? 2 : $boosterStyles.left}rem;

  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;

  @media (max-width: 768px) {
    transform: rotate(0);
    left: ${({ $mobileStyles }) => `${pxToRem($mobileStyles.left)}rem`};
    top: ${({ $mobileStyles }) => `${pxToRem($mobileStyles.top)}rem`};
    ${({ $isOverlay }) =>
      $isOverlay &&
      css`
        top: 0.75rem;
        left: 2rem;
      `}
  }
`;

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-row-gap: 1rem;
  margin: 0;
  border: none;
  max-height: 100%;
  border-radius: 0;
  overflow-y: auto;
  position: relative;

  ::-webkit-scrollbar {
    width: 0;
    display: none;
    visibility: hidden;
  }
`;

export const PopupPricingUnit = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 0;

  ${CTAContainer} {
    position: relative;
    width: 45.5rem;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    padding: 0.75rem 2rem;
    background-color: ${COLORS.BRAND.WHITE};
    box-shadow: 0px -2px 8px 0px #0000001a;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;

    ${StyledPriceBlock} {
      grid-template-columns: repeat(2, max-content);
      grid-column-gap: 0;
      grid-row-gap: 0.125rem;

      .tour-scratch-price {
        justify-content: end;
      }

      .tour-price-container {
        flex-direction: row-reverse;

        .tour-price {
          margin-right: 0;
          margin-left: 0.375rem;

          .strike-through {
            ${expandFontToken(FONTS.HEADING_SMALL)}
          }
        }
      }
    }

    ${CTABlock} {
      a {
        ${ButtonContainer} {
          min-width: 9.875rem;
          width: max-content;
          margin: 0 0 0 auto;
        }
      }
    }
  }
`;
function getMargin({ theme, isTicketCard, $isDrawer, $isSwiperCard }: any) {
  if ($isDrawer) {
    return '0';
  }

  switch (true) {
    case $isSwiperCard:
      return '1rem';
    case theme !== THEMES.MIN_BLUE && !isTicketCard:
      return '1.5rem';
    case isTicketCard:
      return '0';
    default:
      return '24px';
  }
}
export const hohoFont = css`
  font-family: ${HALYARD.FONT_STACK};
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
  color: ${COLORS.GRAY.G1};
  letter-spacing: 0;
  -webkit-text-stroke: 0.2px ${COLORS.GRAY.G1};
`;

export const newVerticalStyles = css`
  grid-template-areas:
    'card-img category-and-rating line cta-combo'
    'card-img title line cta-combo'
    'card-img  tour-tags line cta-combo'
    'card-img  more-details-cta line cta-combo';
  grid-template-rows: auto auto 1fr;
  grid-auto-rows: min-content;
  grid-row-gap: 0.5rem;
  padding: 1rem;
  position: relative;
  .card-img {
    width: 21rem;
    min-height: 13.125rem;
    height: 100%;
    cursor: pointer;
  }
  .tour-tag {
    max-width: unset;
    align-items: start;
    grid-column-gap: 0.375rem;
    svg {
      padding-top: 0.125rem;
    }
  }

  ${StyledPriceBlock} {
    grid-row-gap: 0.125rem;
    .tour-scratch-price {
      font-weight: 400;
      color: ${COLORS.GRAY.G3};
      .strike-through {
        color: ${COLORS.GRAY.G3};
      }
    }
    .tour-price {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
    }
  }
  ${CarouselContainer} {
    border-radius: 10px;
  }
  ${CTAContainer} {
    width: 15.375rem;
    padding-right: 0.5rem;
    grid-gap: 0.625rem;
  }
  ${CTABlock} {
    margin-top: 0.125rem;
  }
  ${NextAvailableBlock} {
    .available-text {
      color: ${COLORS.GRAY.G2};
    }
  }
  ${HorizontalLine} {
    margin-left: 0.313rem;
  }

  ${TourTitleWrapper} {
    ${hohoFont}
    font-size: 21px;
  }
  ${HorizontalLine} {
    border-left: 1px solid ${COLORS.GRAY.G6};
  }
  ${TourTags} {
    grid-row-gap: 0.5rem;
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    grid-area: tour-tags;
  }
  ${StyledRatingsContainer} {
    span {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)}
    }
    .avg-rating {
      ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
    }
  }

  @media (max-width: 768px) {
    grid-template-areas:
      'card-img' 'category-and-rating' 'title' 'tour-tags'
      'price-block';
    grid-row-gap: 0.125rem;
    padding: 0.75rem;
    margin: 0 1rem;
    box-shadow: 0px 2px 8px 0px #0000001a;
    border-radius: 16px;
    transition: transform ease-in-out 300ms;
    &:active:not(:focus-within) {
      transform: scale(0.98);
    }

    .card-img {
      justify-self: center;
      margin-top: 0;
      width: calc(100%);
      margin-bottom: 0.625rem;
      height: auto;
      min-height: unset;
    }
    button.info-icon {
      padding: 0;
      background: none;
      border: none;
    }

    ${TourTitleWrapper} {
      font-size: 18px;
      line-height: 24px;
      -webkit-text-stroke: 0.1px ${COLORS.GRAY.G1};
    }
    ${TitleWrapper} {
      margin-bottom: 0.5rem;
    }

    ${TourTags} {
      margin: 0 0 1.094rem;
      display: grid;
      grid-row-gap: 0.625rem;
      ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
    }
    ${CategoryAndRatingContainer} {
      margin: 0 0 0.125rem;
    }
    ${PriceContainer} {
      margin: 1rem 0 0;
      padding-bottom: 0;
    }
    ${StyledPriceBlock} {
      .tour-price {
        ${expandFontToken(FONTS.HEADING_PRODUCT_CARD)}
      }
    }
  }
`;

export const cruiseStyles = css`
  @media (min-width: 768px) {
    grid-template-areas:
      'card-img category-and-rating line cta-combo'
      'card-img title line cta-combo'
      'card-img  horizontal-tags line cta-combo'
      'card-img  tour-tags line cta-combo'
      'card-img  more-details-cta line cta-combo';
    grid-row-gap: 0.375rem;
    grid-template-rows: auto auto auto 1fr;
    ${StyledRatingsContainer} {
      .avg-rating {
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
      }
      .rating-count {
        ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
      }
    }
    ${TourTags} {
      margin-bottom: 0.25rem;
    }
    ${StyledPriceBlock} {
      .tour-price {
        font-size: 24px;
      }
    }
    ${TourTitleWrapper} {
      font-size: 24px;
    }
  }
  @media (max-width: 768px) {
    &:active:not(:focus-within) {
      transform: unset;
    }
    grid-template-areas:
      'card-img'
      'category-and-rating'
      'title'
      'horizontal-tags'
      'tour-tags'
      'price-block'
      'cta-block'
      'more-details-cta';

    ${CTABlock} {
      grid-area: cta-block;
      margin: 1rem 0 0.5rem;
    }
    ${MoreDetailsBtnWrapper} {
      grid-area: more-details-cta;
      button {
        font-family: ${HALYARD.FONT_STACK};
        letter-spacing: 0;
      }
    }
    ${TourTags} {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
      margin: 0;
      grid-row-gap: 0.375rem;
    }
    ${NextAvailableBlock} .available-text {
      color: ${COLORS.GRAY.G2} !important;
      margin: 0.75rem 0 0;
    }
    ${TitleWrapper} {
      margin-bottom: 0.125rem;
    }
    ${PriceContainer} {
      margin: 0.75rem 0 0;
    }
  }
`;

export const modifiedPopupStyles = css`
  ${TourTags} {
    margin: 0.5rem 0;
  }
  ${NextAvailableBlock} {
    .available-text {
      margin-top: 0.5rem;
    }
  }
  @media (max-width: 768px) {
    grid-template-areas:
      'card-img'
      'category-and-rating'
      'title'
      'horizontal-tags';
    grid-row-gap: 0.75rem;
    ${PriceContainer} {
      display: none;
    }
    ${TourTitleWrapper}, ${TitleWrapper} {
      margin-bottom: 0;
    }
    ${TourTitleWrapper} {
      font-size: 21px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: 0.8;
    }
    ${CategoryAndRatingContainer} {
      margin-bottom: 0.25rem;
    }
    ${TourTags} {
      margin: 0 0 0.25rem 0 !important;
    }
    ${NextAvailableBlock} {
      margin-top: -0.5rem;
      .available-text {
        color: ${COLORS.GRAY.G2} !important;
        margin-top: 0;
      }
    }
  }
`;
