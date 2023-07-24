import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SpecialSectionWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  background: linear-gradient(360deg, #150229 42%, rgba(22, 0, 44, 0) 100%),
    linear-gradient(90deg, #160229 43.54%, rgba(54, 0, 108, 0) 100%);
  margin-bottom: 4rem;
  min-height: 693px;

  .right-corner-illustration {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }

  .right-corner {
    position: absolute;
    z-index: -10;
    right: 0;
    top: 0;
    width: 100%;
    height: 583px;
    background-color: #16002c;
    @media (max-width: 789px) {
      height: 439px;
    }
  }

  .content {
    position: relative;
    padding: 4rem 0 4.5rem 0;
    margin: 0 auto;
    max-width: 1200px;
    z-index: 10;
    overflow: hidden;
  }

  .title {
    ${expandFontToken(FONTS.DISPLAY_REGULAR)};
    color: ${COLORS.BRAND.WHITE};
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    width: 100vw;
    min-height: 0;
    .swiper-slide {
      width: auto;
    }

    .swiper-horizontal {
      margin: 0;
      margin-right: 1.5rem;
    }

    .content {
      margin: 0;
      padding: 2.5rem 0 2.5rem 1.5rem;
    }

    .title {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin-bottom: 1.25rem;
    }
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3.25rem;

  .chips {
    display: flex;

    .action {
      min-width: 90px;
      height: 36px;
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0.75rem;
      margin-right: 0.75rem;
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
      color: ${COLORS.BRAND.WHITE};
      box-sizing: border-box;
      cursor: pointer;
    }

    .selected {
      background: ${COLORS.BRAND.WHITE};
      color: ${COLORS.BRAND.PURPS};
      font-weight: 500;
      border: none;
    }

    .action:not(.selected):hover {
      background: ${COLORS.BRAND.WHITE}30;
      font-weight: 500;
    }
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
      color: ${COLORS.BRAND.WHITE};
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
    margin-bottom: 2rem;

    .title {
      ${expandFontToken(FONTS.HEADING_LARGE)};
    }
    .controls {
      .see-all {
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.2px;
        color: ${COLORS.GRAY.G3};
        padding: 6px 12px;
        margin: 0;
        border: 1px solid #888888;
        border-radius: 4px;
        text-decoration-line: none;
        width: 67px;
        height: 28px;
        box-sizing: border-box;
      }
    }
    .chips {
      display: flex;
      width: 100%;
      overflow-x: scroll;
      display: -webkit-box;
      ::-webkit-scrollbar {
        display: none;
      }
      .action {
        min-width: 61px;
        height: 32px;
        ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
      }

      .selected {
        font-weight: 300px;
      }
    }
  }
`;

export const SeeAllShowsCard = styled.div`
  @media (max-width: 768px) {
    width: 120px;
    height: 180px;

    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;

    background: linear-gradient(
      22.38deg,
      #18022e 0%,
      rgba(1, 0, 1, 0) 96.87%,
      rgba(0, 0, 0, 0) 100%
    );

    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    padding: 2.5rem 1rem;
    box-sizing: border-box;

    .number {
      ${expandFontToken(FONTS.DISPLAY_SMALL)};
      color: ${COLORS.BRAND.WHITE};
      margin-bottom: 2px;
    }

    .see-all-text {
      ${expandFontToken(FONTS.SUBHEADING_XS)};
      margin-bottom: 12px;
      color: ${COLORS.BRAND.WHITE};
    }

    .chevron-right {
      height: 1.5rem;
      width: 1.5rem;
    }
  }
`;
