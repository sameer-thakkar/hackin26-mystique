import styled, { css } from 'styled-components';
import getFontDetailsByLabel from '@headout/aer/src/tokens/typography';
import { Descriptor, DescriptorWrapper } from 'components/StaticBanner/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const HeroSectionContainer = styled.div`
  padding: 1rem 1rem 0 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #efdfff 100%);

  @media (min-width: 769px) {
    padding: 0;
  }
`;

export const MarginWrapper = styled.div<{
  $hasSearchUnit: boolean;
}>`
  max-width: 75rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  position: relative;

  ${DescriptorWrapper} {
    margin-top: 1.25rem;
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
    padding: 2.625rem 0 3.25rem 0;
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
}>`
  ${getFontDetailsByLabel(FONTS.HEADING_LARGE)};
  color: ${COLORS.GRAY.G1};
  margin-bottom: ${({ $hasSearchUnit }) => (!$hasSearchUnit ? 0 : '2rem')};
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

    max-width: ${({ $hasSearchUnit }) =>
      $hasSearchUnit ? 'initial' : '28rem'};

    .travel-mode-text {
      margin-left: 0.25rem;
    }

    &:after {
      content: '';
      display: block;
      bottom: 0;
      margin-top: 1rem;
      width: 40%;
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba(232, 209, 255, 0.8) 0%,
        rgba(247, 239, 255, 0.8) 100%
      );
    }
  }
`;

export const HeroIllustrationContainer = styled.div<{
  $hasSearchUnit: boolean;
  $noTabs: boolean;
}>`
  margin-inline: -1rem;
  display: none;

  img {
    max-width: 100%;

    width: calc(100% + 2rem);
  }

  order: 2;

  ${({ $hasSearchUnit }) =>
    !$hasSearchUnit &&
    `
    display: block;
    margin-bottom: -0.75rem;
  `};

  @media (min-width: 769px) {
    order: 2;

    display: block;

    position: absolute;
    width: auto;
    right: 1rem;
    top: 4.25rem;

    z-index: 0;

    ${({ $noTabs }) => $noTabs && 'top: 2.05rem;'};

    ${({ $hasSearchUnit }) =>
      !$hasSearchUnit &&
      css`
        top: 6rem;
      `};
  }
`;
