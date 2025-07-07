import styled from 'styled-components';
import {
  SavePercentElement,
  ShowPageDateSelectorWrapper,
} from 'components/MicrositeV2/ShowPageV2/ShowPagePricingSection/style';
import { FooterLegal } from 'UI/Footer/style';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { THEMES } from 'const/index';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const StyledHeader = styled.div<any>`
  min-height: ${({ isGlobalMb }) => (isGlobalMb ? '64px' : '80px')};
  .main-wrapper {
    display: grid;
    grid-template-columns: repeat(2, auto);
    justify-content: space-between;
    align-items: center;
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '1.25rem 0' : '0.75rem 0 0.625rem'};
    user-select: none;
  }
  .fixed-wrap {
    ${({ $categoryHeaderMenuExists }) =>
      !$categoryHeaderMenuExists && `position: fixed;`}
    box-shadow: ${({
      isTop,
      isEntertainmentLandingPageVisible,
      $isPillBarSticky,
    }) =>
      !isTop &&
      !isEntertainmentLandingPageVisible &&
      !$isPillBarSticky &&
      '0px -1px 2px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.12)'};
    width: calc(100vw - (100vw - 100%));
    top: 0;
    min-height: ${({ isGlobalMb }) => (isGlobalMb ? '64px' : '80px')};
    border-bottom: ${({ isEntertainmentMb, showColoredHeader }) =>
      isEntertainmentMb && !showColoredHeader && `1px ${COLORS.GRAY.G6} solid`};
    background-color: ${({ theme: { primaryBackground } }) =>
      primaryBackground ? primaryBackground : '#fff'};
    z-index: ${({ overlayActive: check, headerHover }) =>
      check || headerHover ? 100 : 19};
    ${({ isGlobalMb }) =>
      isGlobalMb && `box-shadow: inset 0px -1px 0px ${COLORS.GRAY.G5};`}
    ${({
      isEntertainmentMbListicle,
      $isPillBarSticky,
      $isMonthOnMonthPage,
      $isEntertainmentBanner,
    }) =>
      !$isMonthOnMonthPage &&
      !$isEntertainmentBanner &&
      (isEntertainmentMbListicle || $isPillBarSticky) &&
      `border-bottom: 1px solid ${COLORS.GRAY.G6};`}
      background:${({ showColoredHeader }) =>
      showColoredHeader ? '#150029' : '#fff'};
  }
  .fixed-offset::after {
    content: '';
    display: ${({ $categoryHeaderMenuExists }) =>
      $categoryHeaderMenuExists ? 'none' : 'block'};
    height: ${({ theme: { theme } }) =>
      theme === THEMES.DEFAULT ? '88px' : '80px'};
  }

  ${({ showColoredHeader }) =>
    showColoredHeader &&
    `.fixed-offset::before {
      content: '';
      position: fixed;
      width: 100vw;
      top: 0;
      display: block;
      height: 320px;
      @media (max-width: 789px) {
        height:200px;
      }
    }`}

  .main-wrapper .header-city-selector {
    min-width: 180px;
    font-family: ${HALYARD.FONT_STACK};
  }
  .header-city-selector .toggle-icon svg path {
    stroke-width: 1.5px;
  }
  .header-city-selector .current-selection {
    border-radius: 4px;
    padding: 12px 15px;
    border: 1px solid ${COLORS.GRAY.G2};
  }

  .styled-active-value {
    color: ${({ showColoredHeader }) =>
      showColoredHeader ? COLORS.BRAND.WHITE : COLORS.GRAY.G3};
  }
  @media (max-width: 768px) {
    min-height: ${({ isGlobalMb }) => (isGlobalMb ? '3rem' : '3.5rem')};
    .main-wrapper {
      margin: unset;
      width: calc(100% - (16px * 2));
      padding: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '15px 16px' : '12px 16px'};
      border-bottom: ${({ theme: { theme } }) =>
        theme === THEMES.DEFAULT ? `1px solid ${COLORS.GRAY.G6}` : 'none'};
      background: ${({
        showColoredHeader,
        isCategoryPage,
        $isMonthOnMonthPage,
        $isReviewsPage,
        $isVenuePage,
      }) => {
        switch (true) {
          case showColoredHeader:
            return isCategoryPage ||
              $isMonthOnMonthPage ||
              $isReviewsPage ||
              $isVenuePage
              ? '#1A0232'
              : COLORS.LTT_BANNER_BACKGROUND_COLOR;
          default:
            return '#fff';
        }
      }};
    }
    .fixed-wrap {
      position: fixed;
      min-height: ${({ isGlobalMb }) => (isGlobalMb ? '48px' : '56px')};
      height: ${({ isGlobalMb }) => (isGlobalMb ? '48px' : '56px')};
      background-color: transparent;
    }
    .fixed-offset::after {
      content: '';
      display: block;
      height: ${({ theme: { theme } }) =>
        theme === THEMES.DEFAULT ? '57px' : '32px'};
      margin-bottom: ${({ isGlobalMb }) => (isGlobalMb ? '0' : '24px')};
    }
    .header-links {
      display: none;
    }

    ${({ showColoredHeader, isCategoryPage, $isMonthOnMonthPage }) =>
      showColoredHeader &&
      `.fixed-offset::before {
      background-color:${
        isCategoryPage || $isMonthOnMonthPage
          ? '#1A0232'
          : COLORS.LTT_BANNER_BACKGROUND_COLOR
      };
    }`}
  }
`;

export const ShowPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
  .fixed-offset {
    &::before {
      height: 29.9rem !important;
      z-index: -12;
    }
  }

  .fixed-wrap {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 8px;
  }
  ${StyledHeader} {
    .fixed-wrap {
      z-index: 10;
    }
  }
  @media (max-width: 768px) {
    position: relative;
    .fixed-offset {
      &::before {
        height: 12.5rem !important;
      }
    }
    .search-page {
      position: fixed;
      top: 0;
      height: 100vh;
      width: 100vw;
      z-index: 123123;
      background: white;
    }
  }

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    ${FooterLegal} {
      grid-column-gap: 28px;
    }
  }
`;
export const DateSelectorWrapper = styled.div<{
  $visible: boolean;
  $isShowPageExperiment?: boolean;
  $isAllMediaVisible?: boolean;
}>`
  position: absolute;
  top: ${({ $isShowPageExperiment, $isAllMediaVisible }) =>
    $isShowPageExperiment ? ($isAllMediaVisible ? '20rem' : '24rem') : '24rem'};
  right: calc((100vw - 75rem) / 2);
  height: calc(100% - 369px);

  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};

  @media (max-width: 768px) {
    z-index: 16;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    right: calc((50vw - 25.5rem));
    ${ShowPageDateSelectorWrapper} {
      width: ${({ $isShowPageExperiment }) =>
        $isShowPageExperiment ? '24rem' : '22rem'};
      margin-left: 8rem;
    }
  }
  @media only screen and (min-width: 1024px) and (max-width: 1366px) {
    right: calc((50vw - 30.5rem));
    ${ShowPageDateSelectorWrapper} {
      width: ${({ $isShowPageExperiment }) =>
        $isShowPageExperiment ? '24rem' : '22rem'};
    }
  }

  ${ShowPageDateSelectorWrapper} {
    position: sticky;
    top: 6.5rem;
    z-index: 9;
  }

  @media (max-width: 768px) {
    visibility: visible;
    top: auto;
    right: auto;
    bottom: 0;
    left: 0;
    position: fixed;
    width: 100%;
    transition: bottom 0.3s ease-in;

    ${({ $visible }) =>
      $visible
        ? `

bottom: 0;
    `
        : `
      bottom: -1000px;
    `}

    ${ShowPageDateSelectorWrapper} {
      top: auto;
      right: auto;
      bottom: 0rem;
      left: 0;
      margin: 0;
      width: 100%;
      position: absolute;
    }
  }
`;

export const DateSelectorContainer = styled.div`
  position: relative;
`;
export const BuyButtonWrapper = styled.div<{
  hasDiscount?: boolean;
  longCtaContent?: boolean;
}>`
  padding: 0.75rem 1rem 1rem;
  background-color: ${COLORS.BRAND.WHITE};
  box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.08);

  position: fixed;
  bottom: 0;
  width: 100vw;
  box-sizing: border-box;
  z-index: 2;
  button {
    margin-top: 1rem;
  }

  #mweb-buy-button-pricing {
    display: none;
    @media (max-width: 768px) {
      display: flex;
      .pricing {
        display: flex;
        flex-direction: column;
        .scratch-price {
          ${expandFontToken(FONTS.UI_LABEL_SMALL)};
          color: ${COLORS.GRAY.G3};
        }
        .price {
          display: flex;
          align-items: center;
          margin-top: 0.125rem;
          ${expandFontToken(FONTS.HEADING_SMALL)};
          color: ${COLORS.GRAY.G2};
          margin-right: 0.5rem;
          ${SavePercentElement} {
            ${expandFontToken(FONTS.UI_LABEL_SMALL_HEAVY)};
            height: 1.25rem;
          }
        }
      }
    }
  }

  ${({ hasDiscount }) =>
    !hasDiscount &&
    `
    display: flex;
    justify-content: space-between;
    align-items: center;
    #mweb-buy-button-pricing {
      margin: 0
    }

    button {
      width: 13.3125rem;
      margin: 0;
    }
  `};

  ${({ longCtaContent, hasDiscount }) =>
    !hasDiscount &&
    longCtaContent &&
    `
    button {
      width: 13.3125rem;  
      font-size: 14px;
      line-height: 16px;
      word-spacing: 1rem;
      margin: 0;
    }
  `};
`;

export const FaqWrapper = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: auto;

  h2 {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
  }
  @media (max-width: 768px) {
    h2 {
      ${expandFontToken(FONTS.HEADING_LARGE)};
    }
  }
`;
