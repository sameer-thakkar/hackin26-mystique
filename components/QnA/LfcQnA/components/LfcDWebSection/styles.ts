import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledLfcDWebSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledLfcDWebRow = styled.div`
  display: flex;
  gap: 24px;
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 12px;
  min-height: 164px;

  .question-block {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
    padding: 16px;
    backdrop-filter: blur(12px);
    background: linear-gradient(116.35deg, #fffef7 1.11%, #fcf5ff 100%);
    width: 100%;
    max-width: 288px;
    border-radius: 12px 0 0 12px;
    cursor: pointer;
    border: none;
    text-align: left;
    box-sizing: border-box;
    cursor: pointer;
  }

  .question-block:hover .see-more-responses-cta {
    color: ${COLORS.TEXT.CANDY_1};
    gap: 6px;
  }

  .question-block:hover .see-more-responses-cta svg path {
    stroke: ${COLORS.TEXT.CANDY_1};
  }

  .question-block .see-more-responses-cta {
    border: none;
    text-decoration: underline;
    text-align: left;
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    background: transparent;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    cursor: pointer;
    transition: all 0.3s;
    padding: 0;
    color: ${COLORS.GRAY.G2};
  }

  .question-block .see-more-responses-cta svg {
    height: 12px;
    width: 12px;
  }
  .see-more-responses-cta svg path {
    stroke: ${COLORS.GRAY.G2};
  }

  .question-block-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .question-block-header p,
  .question-block-header h4 {
    padding: 0;
    margin: 0;
  }

  .question-block-header p {
    ${expandFontToken(FONTS.SEMANTICS_TAG_REGULAR)};
    color: ${COLORS.GRAY.G3};
  }
  .question-block-header h4 {
    ${expandFontToken(FONTS.SEMANTIC_HEADING_REGULAR)};
    font-weight: 600;
    letter-spacing: 0;
    font-family: 'halyard-text';
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: ${COLORS.GRAY.G2};
  }

  .reviews-container {
    display: flex;
    width: 100%;
    gap: 32px;
    padding: 20px 16px 20px 0;
  }

  .answer-card-wrapper {
    width: 50%;
  }

  .vertical-line {
    width: 1px;
    height: 100%;
    background: #d0d0d0;
    background-image: linear-gradient(
      90deg,
      #ffffff 0%,
      #d0d0d0 49.5%,
      #ffffff 100%
    );
  }
`;
