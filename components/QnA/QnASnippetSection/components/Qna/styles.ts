import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledQnaAccordionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::after {
    content: '';
    height: 70px;
    width: 100%;
  }
`;

export const StyledQuestionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  z-index: 2;

  h4 {
    ${expandFontToken(FONTS.SUBHEADING_LARGE)};
    padding: 0;
    margin: 0;
  }
`;

export const StyledAccordionBlock = styled.div<{
  $isLastBlock?: boolean;
  $isFirstBlock?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${({ $isLastBlock }) =>
    $isLastBlock
      ? css`
          border-bottom: 0;
          padding: 0;
        `
      : css`
          border-bottom: 1px solid ${COLORS.GRAY.G6};
          padding-bottom: 24px;
        `}

  .more-responses-cta,
  .hide-responses-cta {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    color: ${COLORS.TEXT.CANDY_1};
    -webkit-tap-highlight-color: transparent;
    margin: 0;
    width: max-content;
    padding: 0;
    text-decoration: underline;
    border: 0;
    background: none;
  }

  @media (max-width: 768px) {
    ${({ $isFirstBlock }) => $isFirstBlock && 'padding-top: 1.5rem'};
  }
`;

export const StyledLfcQnaSnippet = styled.section`
  width: 100%;
  padding-bottom: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 1.625rem;
  position: relative;
  height: 73.5vh;
  overflow-y: auto;

  .lfc-qna-body-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  .bottom-spacer {
    height: 70px;
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 16px;
  }
`;
