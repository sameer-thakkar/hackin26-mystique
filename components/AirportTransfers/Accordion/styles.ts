import styled from 'styled-components';
import COLORS from 'const/colors';

export const AccordionWrapper = styled.section<{
  isOpen: boolean;
  isWholeAccordionClickable: boolean;
  isDisabled: boolean;
  isDesktop: boolean;
}>`
  padding-bottom: ${({ isOpen }) => (isOpen ? '0' : '2rem')};
  ${({ isDisabled }) => (isDisabled ? `pointer-events:none;` : ``)}
  ${({ isWholeAccordionClickable }) =>
    isWholeAccordionClickable && `cursor: pointer`};
  display: grid;
  grid-template-rows: max-content max-content;
  grid-row-gap: ${({ isOpen }) => (isOpen ? '1rem' : 0)};

  transition: grid-row-gap 0.05s ease !important;
  &:focus {
    outline: none;
  }

  border-bottom: 1px solid ${COLORS.GRAY.G6};
`;

export const HeaderWrapper = styled.div<{
  isDisabled: boolean;
  isDesktop: boolean;
  isOpen: boolean;
}>`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: 1rem;
  cursor: pointer;
  ${({ isDisabled }) =>
    isDisabled ? `svg{path{stroke:#9F9F9F;}}h2{color:#9F9F9F}` : ``}
  &:focus {
    outline: none;
  }
`;

export const IconWrapper = styled.div<{
  isOpen: boolean;
  isDesktop: boolean;
  isFirst: boolean;
}>`
  display: inline-block;
  align-self: center;
  margin-left: auto;
  cursor: pointer;
  ${({ isOpen }) => isOpen && 'transform: rotate(180deg);'}
  ${({ isFirst }) => isFirst && 'align-self:start;'}
	transition: transform 0.1s ease !important;
`;
export const ContentBlock = styled.div<{
  isOpen: boolean;
  isDesktop: boolean;
  isFirst: boolean;
  isLast: boolean;
}>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};

  padding-bottom: 1.5rem;
  outline: none;
`;
