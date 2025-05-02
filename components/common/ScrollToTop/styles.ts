import styled from 'styled-components';
import COLORS from 'const/colors';
import { DEFAULT_MAGIC_WAND, HOVERED_MAGIC_WAND } from 'assets/magicWand';

export const StyledButton = styled.div<{
  $isLttMonthOnMonthPage: boolean;
  $isHarryPotterPage?: boolean;
}>`
  display: inline-block;
  position: fixed;
  bottom: 5.938rem;
  right: 1.313rem;
  padding: 0.406rem 0.625rem;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1), 0px 4px 22px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  background: ${COLORS.BRAND.WHITE};
  cursor: pointer;
  z-index: 10;

  svg {
    transform: rotate(180deg);
  }

  ${({ $isHarryPotterPage }) =>
    $isHarryPotterPage &&
    `cursor: url("${DEFAULT_MAGIC_WAND}") 0 0, auto;

    &:hover {
      cursor: url("${HOVERED_MAGIC_WAND}") 10 8, auto !important;
    }`}

  @media (max-width: 768px) {
    bottom: ${({ $isLttMonthOnMonthPage }) =>
      $isLttMonthOnMonthPage ? '6rem' : '1.5rem'};
    right: 1rem;
  }
`;
