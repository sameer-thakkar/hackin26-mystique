import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const CategoriesSectionWrapper = styled.div<{
  $isCategoryPage: boolean;
}>`
  margin-top: ${({ $isCategoryPage }) => ($isCategoryPage ? '4rem' : '0')};
  padding: 0;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  > * {
    &:last-child {
      margin-bottom: 0rem;
    }
  }
  @media (max-width: 768px) {
    position: relative;
    width: 100vw;
  }
`;

export const CategoryCarousel = styled.div`
  padding: 0;
  margin-bottom: 4rem;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-bottom: 2.25rem;

    .swiper-slide {
      width: auto;
    }

    .swiper-horizontal {
      width: calc(100vw - 3rem);
    }
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  margin-top: 0;

  .title {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.GRAY.G2};
    margin: 0%;
  }

  .controls {
    display: flex;
    align-items: center;

    .see-all {
      font-family: 'halyard-text', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 13.752px;
      line-height: 16px;
      text-decoration-line: underline;
      cursor: pointer;
      color: ${COLORS.GRAY.G2};
      margin-right: 1.25rem;
      user-select: none;
      -webkit-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;

      :hover {
        color: ${COLORS.PURPS.LEVEL_3};
      }
      svg {
        cursor: pointer;
      }
    }
    .chevron-left,
    .chevron-right {
      cursor: pointer;
      height: 2.25rem;
      width: 2.25rem;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      circle {
        stroke: rgba(121, 121, 121, 0.5);
      }
      :not(.disabled) {
        :hover {
          circle {
            stroke: rgba(121, 121, 121, 0.65);
          }
        }

        :active {
          circle {
            stroke: rgba(121, 121, 121, 0.85);
          }
        }
      }
      path {
        stroke: ${COLORS.GRAY.G2};
      }
      &.disabled {
        opacity: 0.4;
        cursor: default;
      }
    }

    .chevron-left {
      margin-right: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding: 0 1.5rem;

    .title {
      ${expandFontToken(FONTS.HEADING_LARGE)};
    }
    .controls {
      .see-all {
        font-weight: 400;
        font-size: 14px;
        line-height: 14px;
        letter-spacing: 0.2px;
        color: ${COLORS.GRAY.G3};
        padding: 6px 12px;
        margin: 0;
        border: 1px solid #888888;
        border-radius: 0.375rem;
        text-decoration-line: none;
        min-width: 67px;
        height: 28px;
        box-sizing: border-box;
        vertical-align: middle;
        :hover {
          color: ${COLORS.GRAY.G3};
        }
      }
      :active {
        transform: scale(0.98);
      }
    }
  }
`;
