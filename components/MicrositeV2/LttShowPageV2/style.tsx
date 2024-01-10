import styled from 'styled-components';
import { FooterLegal } from 'components/common/Footer';
import { StyledHeader } from 'components/MicrositeV2/Header';
import {
  OverlayWrapper,
  SavePercentElement,
  ShowPageDateSelectorWrapper,
} from 'components/MicrositeV2/LttShowPageV2/ShowPageDateSelector/style';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ShowPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
  .fixed-offset {
    ::before {
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
      ::before {
        height: 5rem !important;
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

  @media only screen and (min-width: 768px) and (max-width: 1366px) {
    ${FooterLegal} {
      grid-column-gap: 28px;
    }
  }
`;
export const DateSelectorWrapper = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 24rem;
  right: calc((100vw - 75rem) / 2);
  height: calc(100% - 369px);

  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};

  @media (max-width: 768px) {
    z-index: 16;
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    right: calc((50vw - 25.5rem));
    ${ShowPageDateSelectorWrapper} {
      width: 22rem;
      margin-left: 8rem;
    }
  }

  @media only screen and (min-width: 1024px) and (max-width: 1366px) {
    right: calc((50vw - 30.5rem));
    ${ShowPageDateSelectorWrapper} {
      width: auto;
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

    ${OverlayWrapper} {
      ${({ $visible }) =>
        $visible
          ? `
        display: block;
    `
          : `
        display: none;  
    `}
    }
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
  padding: 0.75rem 1.5rem 1rem;
  background-color: ${COLORS.BRAND.WHITE};
  border-radius: 0 0 1rem 1rem;
  box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.08);

  position: fixed;
  bottom: 0;
  width: 100vw;
  box-sizing: border-box;
  z-index: 2;
  button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      margin-right: 0.25rem;
    }
  }

  #mweb-buy-button-pricing {
    display: none;
    @media (max-width: 768px) {
      display: flex;
      margin-bottom: 1rem;
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
          .strike-through {
            ${expandFontToken(FONTS.HEADING_SMALL)};
            color: ${COLORS.GRAY.G2};
            margin-right: 0.5rem;
          }
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
      width: auto;
      max-width: 182px;
      padding: 0.75rem 1rem;
    }
  `};

  ${({ longCtaContent, hasDiscount }) =>
    !hasDiscount &&
    longCtaContent &&
    `
    button {
      padding: 0.5rem 0.75rem;
      font-size: 14px;
      line-height: 16px;
      word-spacing: 5px;
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
