import styled from 'styled-components';
import { Wrapper } from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard/style';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const TopShowsWrapper = styled.div<{
  $isCategoryPage: boolean;
  $hasShowCampaign?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 0.5rem;
  margin-bottom: 4rem;

  .title {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin: 0 0 1.75rem;
    display: flex;
    flex-direction: row;
    align-items: start;
  }

  .shows {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 0fr));
    grid-column-gap: 24px;
    grid-row-gap: 56px;
    margin: 0 auto;
    width: 100%;
  }
  @media (min-width: 768px) {
    ${({ $hasShowCampaign }) =>
      $hasShowCampaign &&
      `
      .title {
        margin-bottom: 2.25rem;
      }
      .shows > :first-child {
        grid-column: span 1;
        min-width: 12.75rem;
        margin-left: -0.75rem;
      }
    `}
  }

  button {
    margin: 2.75rem auto 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 16.625rem;
    border: 1px solid ${COLORS.BRAND.BLACK};
    height: 3rem;
    border-radius: 0.5rem;
    background: ${COLORS.BRAND.WHITE};
    cursor: pointer;
    ${expandFontToken(FONTS.BUTTON_MEDIUM)};
    color: ${COLORS.GRAY.G2};

    :hover {
      transition: all 100ms ease-out;
      background: ${COLORS.GRAY.G8};
    }

    :active {
      transform: scale(0.9583);
      border-radius: 0.475rem;
    }
  }

  .card-wrapper {
    position: relative;
    box-sizing: border-box;
    &:hover {
      transition: ease-in-out 150ms;
      transform: translate3d(0, -5px, 0);
    }

    &.your-pick {
      padding: 0.75rem;
      border-radius: 1rem;
      margin-top: -0.875rem;
      border: 1px solid #d0bc8b;
      background: linear-gradient(
        345deg,
        #fff5d0 0%,
        #fff8dd 49.42%,
        #fff5d0 98.83%
      );

      .image-placeholder {
        margin-top: 0.75rem;
      }
      @media (min-width: 768px) {
        :active {
          transition: ease-in-out 300ms;
          transform: scale(0.98);
        }
      }

      ${Wrapper} {
        :active {
          transform: none;
        }
      }
    }

    .your-pick-title {
      position: absolute;
      top: -1px;
      left: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: min-content;

      .your-pick-background {
        position: absolute;
      }

      .text {
        position: relative;
        bottom: 3px;
        z-index: 2;
        color: #40330d;
        text-shadow: 0px 1px 1px rgba(249, 211, 87, 0.9);
        ${expandFontToken(FONTS.HEADING_XS)};
        font-size: 0.875rem;
        font-style: italic;
        font-weight: 600;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        svg {
          margin-right: 0.125rem;
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding-top: 0;

    .product-card-container {
      position: relative;
      margin: 0 1.5rem;
      transition: ease-in-out 150ms;
      :active {
        transform: scale(0.98);
      }
    }
    .card-wrapper {
      max-width: initial;
      &:hover {
        transform: none;
      }

      &.your-pick {
        margin: 0 -0.75rem;
        width: calc(100vw - 2rem);
      }

      .your-pick-title {
        top: -1.625rem;
        height: 2.625rem;
        border-radius: 1rem 1rem 0 0;
        width: calc(100% + 2px);
        left: -1px;
        background: linear-gradient(
          94deg,
          #a57e22 -1.34%,
          #ebc755 24.08%,
          #cdad3c 51.71%,
          #c6a53d 76.36%,
          #a17e1a 101.99%
        );
        z-index: -1;
        justify-content: start;

        .text {
          bottom: 8px;
          left: 1rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          svg {
            height: 1rem;
            width: 1rem;
            margin-right: 0.125rem;
          }
        }
      }
    }

    .title {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin: 0.5rem 0 1rem;
      display: flex;
      flex-direction: row;
      align-items: start;
      padding: 0 1.5rem;
      ${({ $hasShowCampaign }) =>
        $hasShowCampaign &&
        `
      margin-bottom: 2.375rem;
    `}
    }

    .shows {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 100%;
      padding: 0;
      width: auto;
      margin: 0;
    }
    button {
      width: calc(100% - 3rem);
      max-width: 355px;
      margin: 1.5rem auto 0;
    }
  }
`;

export const Badge = styled.div<{ index: number }>`
  position: absolute;
  left: -10px;
  top: 220px;
  transition: ease 0.2s;
  z-index: 1;

  .rank {
    position: absolute;
    font-size: 24px;
    color: #93f;
    font-family: 'halyard-display', sans-serif;
    font-size: 48px;
    font-style: italic;
    font-weight: 700;
    line-height: normal;
    text-shadow: -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff,
      2px 2px 0 #fff;
    letter-spacing: -1px;
  }

  @media (max-width: 768px) {
    left: 108px;
    top: -16px;

    .rank {
      right: ${({ index }) =>
        index >= 20 ? '1%' : index >= 10 ? '5%' : '20%'};
      text-align: right;
      font-size: 36px;
      letter-spacing: 0.4px;
    }
  }
`;
