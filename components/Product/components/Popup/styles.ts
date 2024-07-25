import styled from 'styled-components';
import { DEFAULT_MAGIC_WAND, HOVERED_MAGIC_WAND } from 'assets/magicWand';

export const StyledPopupContent = styled.div<{ $isHarryPotterPage?: boolean }>`
  height: 100%;
  width: 100%;

  ${({ $isHarryPotterPage }) =>
    $isHarryPotterPage &&
    `
      cursor: url("${DEFAULT_MAGIC_WAND}") 0 0, auto !important;

    button,
    a,
    .image-list-section img,
    .gallery-children,
    span[role='button'],
    .rating-count .underline,
    .free-cancellation,
    div[role='button'] > svg,
    button > svg,
    div[role='button'].question,
    div[role='button'] > .question-text,
    .chevron-icon,
    .chevron-icon svg,
    .chevron,
    .navigation-link {
      cursor: url("${HOVERED_MAGIC_WAND}") 10 8, auto !important;
    }`}
`;
