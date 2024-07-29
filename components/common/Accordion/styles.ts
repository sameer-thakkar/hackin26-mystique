import styled, { CSSProp } from 'styled-components';
import COLORS from 'const/colors';

export const AccordionContainer = styled.div<{ $containerStyles?: CSSProp }>`
  width: 100%;
  border-radius: 4px;
  background-color: ${COLORS.GRAY.G8};
  ${({ $containerStyles }) => ($containerStyles ? $containerStyles : '')}
`;

export const AccordionItem = styled.div<{ $itemStyles?: CSSProp }>`
  background-color: ${COLORS.BRAND.WHITE};
  margin: 1rem 0;
  padding: 0.75rem;
  &:first-of-type {
    margin-top: 0;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
  ${({ $itemStyles }) => ($itemStyles ? $itemStyles : '')}
`;

export const AccordionHeader = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

export const AccordionBody = styled.div<{
  $isOpen: boolean;
  $height: number | undefined;
}>`
  overflow: hidden;
  height: ${({ $height = 0 }) => `${$height / 16}rem`};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: height 0.3s cubic-bezier(0, 0, 0.3, 1),
    opacity 1s cubic-bezier(0, 0, 0.3, 1);
`;

export const AccordionIcon = styled.div`
  svg path {
    stroke: ${COLORS.GRAY.G2};
  }
`;
