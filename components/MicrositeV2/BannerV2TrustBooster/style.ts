import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div<{ $isHOHORevamp?: boolean }>`
  margin-top: 0;
  padding-top: 1rem;

  ${({ $isHOHORevamp }) =>
    $isHOHORevamp &&
    `width: 100%; 
     height: 0;
     z-index:1; `}

  @media (max-width: 768px) {
    height: 2.5625rem;
    margin-top: 0;
    width: 100%;
    display: flex;

    margin: 1.5rem 0 0 0;
    padding: 0 0 1.1875rem 0;
    background: linear-gradient(
      180deg,
      rgba(80, 64, 111, 0) 0%,
      rgba(70, 56, 96, 0.6) 100%
    );
    ${({ $isHOHORevamp }) =>
      $isHOHORevamp &&
      `min-width: unset;
       padding: 0 0 2rem 0;
       margin: 0;
    `}
  }
`;

export const Wrapper = styled.div<{ $isHOHORevamp?: boolean }>`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: 0 auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-bottom: 1.25rem;

  .trust-booster {
    .icon {
      margin-right: 0.75rem;
      width: 2.5rem;
      height: 2.5rem;
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

  ${({ $isHOHORevamp }) =>
    $isHOHORevamp &&
    `width: unset;
     padding:0; `}

  @media (max-width: 768px) {
    width: calc(100% - (1rem * 2));
    max-width: 1200px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0;

    .swiper {
      margin: 0;
    }
    .trust-booster {
      height: 2.5625rem;
      margin: 0px;
      z-index: -1;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 0.5rem;
        &,
        svg {
          height: 2.25rem;
          width: 2.25rem;
        }
      }
    }
    .swiper-slide {
      height: 2.5625rem !important;
    }
  }
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
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
