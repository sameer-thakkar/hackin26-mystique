import styled from 'styled-components';
import COLORS from 'const/colors';

export const StyledButton = styled.div`
  display: inline-block;
  position: fixed;
  bottom: 5.938rem;
  right: 1.313rem;
  padding: 0.406rem 0.625rem;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1), 0px 4px 22px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  background: ${COLORS.BRAND.WHITE};
  cursor: pointer;
  z-index: 2;

  svg {
    transform: rotate(180deg);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1rem;
  }
`;
