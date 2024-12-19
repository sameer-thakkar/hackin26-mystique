import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledLfcQnaSection = styled.section`
  width: 100%;
  padding-bottom: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 1.625rem;

  .lfc-qna-body-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    gap: 1rem;
    padding-bottom: 2.5rem;
  }
`;

export const LfcSectionHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1rem;

  h2 {
    ${expandFontToken(FONTS.SEMANTIC_DISPLAY_XS)}
    color: ${COLORS.GRAY.G1};
    margin: 0;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 0;
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
  }

  .guest-count {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
  }

  .guest-count:before {
    content: '';
    display: inline-block;
    width: 1px;
    height: 1.75rem;
    background-color: #e2e2e2;
    margin-right: 0.5rem;
  }

  .guest-count div {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .guest-count svg,
  .guest-count svg path {
    width: 1.125rem;
    height: 1.125rem;
    margin-top: 0.125rem;
  }

  .guest-count-number {
    color: #078842;
    ${expandFontToken(FONTS.SEMANTIC_HEADING_REGULAR)};
  }

  .guest-count span {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.PARAGRAPH_LARGE)};
  }

  @media (max-width: 768px) {
    gap: 0.5rem;

    .section-heading {
      padding-left: 1.5rem;
      ${expandFontToken(FONTS.SEMANTIC_HEADING_REGULAR)};
      font-family: 'halyard-text';
      letter-spacing: 0;
    }

    .guest-count svg,
    .guest-count svg path {
      width: 0.75rem;
      height: 0.75rem;
    }

    .guest-count {
      gap: 0.125rem;
      display: flex;
      align-items: center;
      height: 1.375rem;
    }

    .guest-count-number {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)};
      font-weight: 500;
      font-family: 'halyard-text';
      letter-spacing: 0;
    }

    .guest-count span {
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
      font-family: 'halyard-text';
      letter-spacing: 0;
    }

    .guest-count div {
      gap: 0.25rem;
    }

    h2 {
      ${expandFontToken(FONTS.HEADING_REGULAR)}
      font-family: 'halyard-text';
      letter-spacing: 0;
    }

    p {
      ${expandFontToken(FONTS.PARAGRAPH_REGULAR)}
    }
  }
`;

export const CrawlableContent = styled.div`
  display: none;
`;
