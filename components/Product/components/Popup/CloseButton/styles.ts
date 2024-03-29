import styled from 'styled-components';
import COLORS from 'const/colors';

export const ButtonContainer = styled.button<{ $isHighlighted?: boolean }>`
  border-radius: 8px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  border: none;
  background-color: ${({ $isHighlighted }) =>
    $isHighlighted ? '#0000004D' : 'transparent'};
  z-index: 2;
  top: 0.75rem;
  right: 0.75rem;
  transition: background-color 0.5s;
  cursor: pointer;

  svg {
    height: 0.8rem;
    width: 0.8rem;
    stroke: ${({ $isHighlighted }) =>
      $isHighlighted ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
    fill: ${({ $isHighlighted }) =>
      $isHighlighted ? COLORS.BRAND.WHITE : COLORS.GRAY.G2};
    transition: all 0.5s;
  }
`;
