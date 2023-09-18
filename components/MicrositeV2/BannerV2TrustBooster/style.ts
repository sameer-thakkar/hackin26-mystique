import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div<{ hasPinnedCard?: boolean }>`
  margin-top: 1.125rem;
  @media (max-width: 768px) {
    height: 4.5rem;
    margin-top: 0;
    width: 100%;
    height: fit-content;
    height: 5rem;
    padding-top: 0.5rem;
    background: ${({ hasPinnedCard }) =>
      hasPinnedCard
        ? '#150328'
        : `linear-gradient(
      180deg,
      rgba(45, 35, 64, 0) 0%,
      rgba(45, 35, 64, 0.6) 100%
    )`};
  }
`;

export const Wrapper = styled.div<{ hasPinnedCard?: boolean }>`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 1.25rem;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ${({ hasPinnedCard }) =>
    hasPinnedCard &&
    `
    border-image: linear-gradient(to right, #ffffff20, transparent) 1;
    border-width: 0;
    border-bottom-width: 1px;
    border-style: solid;
    padding-bottom: 1.75rem;`}

  .trust-booster {
    margin-bottom: 1.25rem;

    .icon {
      margin-right: 0.5rem;
    }
    display: flex;
    h3,
    p {
      margin: 0;
    }
    h3 {
      ${expandFontToken(FONTS.HEADING_XS)};
      color: ${COLORS.BRAND.WHITE};
    }
    p {
      ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
      color: ${COLORS.GRAY.G6};
    }
  }
  .trust-booster::first-child {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    height: 5rem;
    width: calc(100% - (1.5rem * 2));
    max-width: 1200px;
    box-sizing: border-box;
    margin-top: 1.25rem;
    overflow: hidden;
    height: 3.8125rem;

    .trust-booster {
      height: 2.5625rem;
      margin: 0px;
      z-index: -1;
    }
    .swiper-slide {
      height: 2.5625rem !important;
    }
  }
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    padding: 0;
    .trust-booster {
      margin-right: 1.5rem;
      box-sizing: border-box;
      min-height: 2.625rem;
    }
  }
`;

export const SepratorGradient = styled.hr`
  hr {
    background: linear-gradient(to right, #fff, #00000000);
    height: 1px;
  }
`;
