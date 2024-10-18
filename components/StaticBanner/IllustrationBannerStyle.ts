import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import { Descriptor, DescriptorWrapper } from 'components/StaticBanner/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const HeroSectionContainer = styled.div`
  position: relative;
  padding: 1rem 1rem 0 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f9f4ff 100%);
  border-top: 1.5px solid ${COLORS.GRAY.G7};

  @media (min-width: 769px) {
    padding: 0;
    border-top: unset;
  }
`;

export const MarginWrapper = styled.div<{
  $hasSearchUnit: boolean;
  $isIllustrationBanner?: boolean;
}>`
  max-width: 75rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  position: relative;

  ${DescriptorWrapper} {
    margin-top: 0.75rem;
    margin-inline: -1rem;
    width: calc(100% + 2rem);

    ${Descriptor} {
      margin-bottom: 1rem;
      .image-wrap {
        display: flex;
        align-items: center;
        img {
          margin-top: 0.1rem;
        }
      }
      span {
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      }
    }

    order: 3;
  }

  @media (min-width: 769px) {
    padding: ${({ $isIllustrationBanner }) =>
      $isIllustrationBanner ? '2.625rem 0 2.5rem 0' : '2.625rem 0 3.25rem 0'};
    min-width: max-content;

    ${DescriptorWrapper} {
      margin-top: 0;
      display: flex;
      gap: 1rem;
      margin-inline: 0;
      width: auto;
      order: 1;
      z-index: 1;

      ${Descriptor} {
        margin-bottom: 0;
        span {
          ${expandFontToken(FONTS.UI_LABEL_LARGE)};
        }
      }

      & > div {
        gap: 0.5rem;
        margin-bottom: 0;
      }

      ${({ $hasSearchUnit }) =>
        !$hasSearchUnit &&
        css`
          flex-direction: column;
          margin-top: 0.5rem;
        `};
    }

    ${({ $hasSearchUnit }) =>
      !$hasSearchUnit &&
      css`
        padding-top: 3.9375rem;
        padding-bottom: 4rem;
      `};
  }
`;

export const HeroText = styled.h1<{
  $hasSearchUnit: boolean;
  $isIllustrationBanner?: boolean;
}>`
  ${getFontDetailsByLabel(FONTS.HEADING_LARGE)};
  color: ${COLORS.GRAY.G1};
  margin-bottom: ${({ $hasSearchUnit, $isIllustrationBanner }) =>
    !$hasSearchUnit || $isIllustrationBanner ? 0 : '2rem'};
  margin-top: 0;

  box-sizing: border-box;
  order: 0;

  max-width: 89%;

  .relative {
    overflow: hidden;
    z-index: 1;
  }

  .travel-mode-text {
    color: ${COLORS.TEXT.PURPS_3};
    white-space: nowrap;
    opacity: 0;
    display: inline-block;
    z-index: 0;
  }

  @keyframes rotate {
    0% {
      transform: translateY(10px);
      opacity: 0;
    }

    5%,
    85% {
      transform: translateY(0);
      opacity: 1;
    }

    100% {
      transform: translateY(-10px);
      opacity: 0;
    }
  }

  @media (min-width: 769px) {
    ${getFontDetailsByLabel(FONTS.DISPLAY_REGULAR)};
    margin-bottom: 1rem;
    z-index: 1;

    max-width: ${({ $isIllustrationBanner, $hasSearchUnit }) =>
      $isIllustrationBanner ? '60%' : $hasSearchUnit ? 'initial' : '28rem'};

    .travel-mode-text {
      margin-left: 0.25rem;
    }

    &:after {
      content: '';
      display: block;
      bottom: 0;
      margin-top: 1rem;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba(232, 209, 255, 0.8) 0%,
        rgba(252, 250, 255, 0.8) 100%
      );
    }
  }
`;

export const HeroIllustrationContainer = styled.div<{
  $hasSearchUnit: boolean;
  $noTabs: boolean;
  $isIllustrationBanner?: boolean;
}>`
  margin-inline: -1rem;
  display: none;
  order: 2;

  img {
    max-width: 100%;
    width: calc(100% + 2rem);
  }

  ${({ $hasSearchUnit }) =>
    !$hasSearchUnit &&
    `
    display: block;
    margin-bottom: -0.75rem;
  `};

  @media (max-width: 768px) {
    ${({ $isIllustrationBanner }) =>
      $isIllustrationBanner &&
      css`
        display: block;
        height: 6.5rem;
        overflow: hidden;
        border-bottom: 1px solid rgba(205, 147, 255, 0.5);
        img {
          object-fit: cover;
          transform: scale(1.13);
        }
      `};
  }

  @media (min-width: 769px) {
    order: 2;

    display: block;

    position: absolute;
    width: auto;
    right: 1rem;
    top: 4.25rem;

    z-index: 0;

    ${({ $noTabs }) => $noTabs && 'top: 2.05rem;'};
    ${({ $isIllustrationBanner }) =>
      $isIllustrationBanner && 'bottom: 0; top: unset;'}
    ${({ $hasSearchUnit }) =>
      !$hasSearchUnit &&
      css`
        top: 6rem;
      `};
  }
`;
