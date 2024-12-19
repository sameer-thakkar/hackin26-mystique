import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const StyledQnaAnswerCard = styled.div<{
  $lastBlock?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${({ $lastBlock }) => $lastBlock && `margin-bottom: 0;`}
`;

export const StyledAnswerCardInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledImgWrapper = styled.div<{ $isSnippetSection?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 2.25rem;
  height: 2.25rem;
  background-color: ${COLORS.GRAY.G6};
  border-radius: 50%;

  .reviewer-image img {
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    @media (max-width: 768px) {
      width: ${({ $isSnippetSection }) =>
        $isSnippetSection ? '1.875rem' : '2.25rem'};
      height: ${({ $isSnippetSection }) =>
        $isSnippetSection ? '1.875rem' : '2.25rem'};
    }
  }
`;

export const StyledAnswerCardInfoRight = styled.div<{
  $isSnippetSection?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex: 1;

  p {
    margin: 0;
    padding: 0;
  }

  .reviewer-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .reviewer-rating {
    line-height: 0;
    padding: 0;
    margin: 0;
    display: flex;
    width: max-content;

    svg,
    path {
      width: 12px;
      height: 12px;
    }
  }

  .reviewer-rating div {
    margin: 0;
    display: flex;
    gap: 2px;
  }

  .reviewer-name {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    color: ${COLORS.GRAY.G2};
    padding: 0;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
  }

  .reviewer-country {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${COLORS.GRAY.G3};
    padding: 0;
  }

  .reviewer-country:before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: ${COLORS.GRAY.G4};
    margin: auto 6px;
    margin-bottom: 0.15rem;
  }

  .date-block {
    ${expandFontToken(FONTS.UI_LABEL_SMALL)};
    color: ${COLORS.GRAY.G3};
    padding: 0;
  }

  @media (max-width: 768px) {
    .reviewer-info {
      gap: 2px;
    }

    .reviewer-rating svg,
    .reviewer-rating path {
      width: 10px;
      height: 10px;
    }

    .reviewer-name {
      ${({ $isSnippetSection }) =>
        $isSnippetSection
          ? `
        ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)}
        line-height: 20px;
      `
          : `
      ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}`};
    }
  }
`;

export const StyledAnswerContent = styled.button<{
  $showReadMore: boolean;
}>`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
  -webkit-tap-highlight-color: transparent;

  .plus-icon,
  .minus-icon {
    color: ${COLORS.GRAY.G2};
    font-weight: 200;
    font-size: 16px;
  }

  button {
    border: none;
    background: none;
    width: max-content;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .show-less,
  .read-more {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .show-less {
    ${({ $showReadMore }) =>
      $showReadMore ? 'display: none;' : 'display: inline-block;'}
  }
  .read-more {
    ${({ $showReadMore }) =>
      $showReadMore ? 'display: inline-block;' : 'display: none;'}
  }

  p {
    color: ${COLORS.GRAY.G2};
    margin: 0;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    font-size: 0.875rem;
    transition: all 0.3s ease-in-out;

    ${({ $showReadMore }) =>
      $showReadMore
        ? `
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;`
        : `
          display: unset;
      -webkit-line-clamp: unset;
      overflow: unset;`}
  }

  span {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
    padding: 0;
  }

  @media (max-width: 768px) {
    p {
      ${({ $showReadMore }) =>
        $showReadMore
          ? `
            display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
  `
          : `
          display: unset;
      -webkit-line-clamp: unset;
      overflow: unset;`}
    }
  }
`;
