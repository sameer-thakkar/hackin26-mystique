import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const ReviewSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      ${expandFontToken(FONTS.DISPLAY_REGULAR)};
      color: ${COLORS.GRAY.G2};
      margin-bottom: 2.125rem;
    }

    .controls {
      svg:first-child {
        margin-right: 0.5rem;
      }
      svg {
        cursor: pointer;
      }
    }
  }

  .reviews {
    display: flex;
    width: 100%;
  }

  @media (max-width: 768px) {
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 1.5rem;
    .title {
      ${expandFontToken(FONTS.HEADING_LARGE)};
      margin-bottom: 1rem;
    }
    .reviews {
      display: block;
      width: 326px;
    }
    .swiper-slide {
      height: auto;
    }
  }
`;

export const Review = styled.div`
  width: 383px;
  min-height: 234px;
  height: 100%;
  padding: 1.25rem 1.5rem 1.125rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    137.42deg,
    rgba(255, 236, 255, 0.21) 0.88%,
    rgba(226, 216, 255, 0.31) 76.06%
  );
  border-radius: 8px;

  .details {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.75rem;
    justify-content: start;

    .pfp {
      width: 44px;
      height: 44px;
      margin-right: 0.5rem;
    }

    .user-details {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;

      .left {
        display: flex;
        flex-direction: column;

        .name {
          ${expandFontToken(FONTS.HEADING_SMALL)};
          color: ${COLORS.GRAY.G2};
          margin-bottom: 2px;
        }
        .country {
          ${expandFontToken(FONTS.UI_LABEL_REGULAR)};
          color: ${COLORS.GRAY.G3};
        }
      }
    }
  }
  .text-content {
    flex: 1;
    min-height: 108px;
    ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
    color: ${COLORS.GRAY.G3};
    margin: 0.75rem 0;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid rgba(68, 68, 68, 0.4);
  }
  .show-name {
    height: 1.25rem;
    ${expandFontToken(FONTS.PARAGRAPH_SMALL)};
    color: ${COLORS.GRAY.G4};
    text-decoration-line: underline;
  }

  @media (max-width: 768px) {
    width: 326px;
    min-height: 249px;
    box-sizing: border-box;

    .reviews {
      position: relative;
      width: 100vw;
    }

    .text-content {
      flex: 1;
      min-height: 128px;
    }
  }
`;
