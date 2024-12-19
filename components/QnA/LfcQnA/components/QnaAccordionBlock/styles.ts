import styled, { css } from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledQnaAccordionBlock = styled.div<{
  $isLastBlock: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  -webkit-tap-highlight-color: transparent;
  ${({ $isLastBlock }) =>
    $isLastBlock
      ? css`
          border-bottom: 0;
          padding: 0;
        `
      : css`
          border-bottom: 1px solid #e2e2e2;
          padding-bottom: 24px;
        `}
`;

export const StyledQuestionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;

  h4 {
    ${expandFontToken(FONTS.UI_LABEL_LARGE_HEAVY)};
    padding: 0;
    margin: 0;
    max-width: 90%;
  }
`;

export const StyledAnswersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const StyledAnswerWrapper = styled.div<{ isVisible?: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  flex-direction: column;
  gap: 1rem;

  ${({ isVisible }) => !isVisible && 'padding-bottom: 0;'}

  .more-responses-cta,
  .hide-responses-cta {
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    color: ${COLORS.TEXT.CANDY_1};
    margin: 0;
    width: max-content;
    padding: 0;
    text-decoration: underline;
    border: 0;
    background: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    z-index: 2;
  }
`;
