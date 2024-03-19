import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SimilarShowsWrapper = styled.div`
  width: calc(100% - (5.46vw * 2));
  max-width: 1200px;
  margin: auto;
  padding: 4rem 0 4rem 1.5rem;

  overflow: hidden;

  -webkit-user-select: none;
  user-select: none;

  @media (max-width: 768px) {
    margin: 0;
    width: auto;
    padding-bottom: 1.75rem;
    .swiper-slide {
      width: auto;
    }

    .swiper-horizontal {
      padding-right: 2rem;
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
    margin: 0;
  }

  .controls {
    display: flex;
    align-items: center;

    .see-all {
      font-family: 'halyard-text', sans-serif;
      font-style: normal;
      font-size: 1.0625rem;
      font-style: normal;
      font-weight: 300;
      line-height: 1.25rem;
      text-decoration-line: underline;
      cursor: pointer;
      color: ${COLORS.GRAY.G2};
      margin-right: 1.25rem;
      user-select: none;
    }

    svg {
      cursor: pointer;
    }
    .chevron-left {
      margin-right: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;

    .title {
      ${expandFontToken(FONTS.HEADING_REGULAR)};
    }
    .controls {
      .see-all {
        ${expandFontToken(FONTS.BUTTON_SMALL)};
        color: ${COLORS.GRAY.G3};
        padding: 6px 12px;
        margin: 0;
        border: 1px solid #888888;
        border-radius: 4px;
        text-decoration-line: none;
        min-width: 67px;
        height: 28px;
        box-sizing: border-box;
        vertical-align: middle;
      }
    }
  }
`;
