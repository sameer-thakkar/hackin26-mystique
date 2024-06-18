import styled, { css } from 'styled-components';
import { LoaderWrapper } from 'components/common/Loader';
import {
  ButtonContainer,
  CTABlock,
  CTAContainer,
  PopupPricingUnit,
  PriceContainer,
} from 'components/Product/styles';
import { StyledTab, StyledTabWrapper } from 'components/slices/TabWrapper';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const HeadingContainer = styled.div<{
  $isTimelineModal?: boolean;
  $isHeaderSticky?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem 0.5rem;

  h3 {
    margin: 0;
    ${expandFontToken(FONTS.HEADING_LARGE)}
  }
  svg {
    background: ${COLORS.GRAY.G7};
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
    margin-top: 0.25rem;
  }

  ${({ $isTimelineModal, $isHeaderSticky }) =>
    $isTimelineModal &&
    css`
      border-bottom: 1px solid ${COLORS.GRAY.G7};
      justify-content: flex-start;
      padding: 0 1.5rem 1.5rem;
      align-items: center;
      ${$isHeaderSticky &&
      `box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s ease-in;
      `}

      svg {
        margin-right: 1.75rem;
      }
    `}

    @media (max-width: 768px) {
      padding: 1.5rem;
      h3 {
        ${expandFontToken(FONTS.HEADING_REGULAR)}
      }
      ${({ $isTimelineModal }) =>
        $isTimelineModal &&
        css`
          align-items: start;
          padding: 1rem;
          svg {
            margin-right: 1rem;
            padding: 0.438rem 0.559rem;
          }
        `}
`;

export const MainContainer = styled.div<{
  $isTimelineModal?: boolean;
  $showLoader?: boolean;
  $showSideModal?: boolean;
}>`
  display: flex;
  flex-direction: column;
  margin: 0;
  border: none;
  max-height: 100%;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  height: max-content;
  transition: transform 0.3s ease-in-out;
  ${({ $showLoader }) =>
    $showLoader &&
    css`
      height: 70vh;
    `}

  ${({ $isTimelineModal, $showSideModal }) =>
    $isTimelineModal
      ? css`
          position: fixed;
          width: 100%;
        `
      : css`
          ${$showSideModal && `transform: translateX(-100%)`};
          overflow: visible;
          height: 100%;
        `}

  ${LoaderWrapper} {
    height: 100%;
    width: 100%;
    .loader {
      height: 5rem;
      width: 5rem;
    }
  }

  ${StyledTabWrapper} {
    display: flex;
    flex-direction: column;
    padding: 0 0 1.5rem;
    overflow: hidden;
    gap: 0;
    .tabs {
      padding: 0 1.5rem;
      gap: 1.5rem;
    }
    .tab-content-wrap {
      padding-bottom: 4rem;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      ::-webkit-scrollbar {
        width: 0.2rem;
      }
      ::-webkit-scrollbar-thumb {
        background: ${COLORS.GRAY.G6};
      }
    }
  }

  @media (min-width: 768px) {
    ${({ $isTimelineModal }) =>
      $isTimelineModal &&
      css`
        max-height: unset;
        height: calc(100% + 24px);
      `}
  }
  @media (max-width: 768px) {
    ${({ $isTimelineModal }) =>
      $isTimelineModal &&
      css`
        height: 100%;
        max-height: 90vh;
      `}
    ${StyledTabWrapper} {
      gap: 0;
      padding: 0;
      overflow: hidden;
      ${StyledTab} {
        ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)}
      }
      .tabs {
        padding: 0 1rem;
        gap: 1rem;
        overflow-x: visible;
      }
      .tab-content-wrap {
        overflow-y: scroll;
        padding: 1rem 0 7.95rem;
      }
    }
  }
`;

export const PricingContainer = styled.div<{ $noDiscount?: boolean }>`
  ${PopupPricingUnit} {
    width: 100%;
    ${CTAContainer} {
      width: auto;
      border-radius: unset;
      justify-content: flex-end;
    }
  }
  @media (max-width: 768px) {
    && {
      ${PopupPricingUnit} {
        ${CTAContainer} {
          flex-direction: column;
          padding: 0.75rem 1rem 1rem;
          ${({ $noDiscount }) =>
            $noDiscount &&
            css`
              flex-direction: row;
              ${PriceContainer} {
                flex: 1;
              }
              ${CTABlock} {
                flex: 2;
              }
            `}
        }
        ${PriceContainer}, ${CTABlock}, a ${ButtonContainer} {
          width: 100%;
          margin: 0;
        }
        ${PriceContainer} {
          .tour-price-container {
            flex-direction: row;
            .tour-price {
              margin: 0;
            }
          }
          .tour-scratch-price {
            justify-content: start;
            font-weight: 300;
            color: ${COLORS.GRAY.G3};
            .strike-through {
              color: ${COLORS.GRAY.G3};
            }
          }
          .tour-price {
            .strike-through {
              color: ${COLORS.GRAY.G3};
            }
          }
        }
      }
    }
  }
`;
