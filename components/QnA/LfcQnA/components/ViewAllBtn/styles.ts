import styled from 'styled-components';
import COLORS from 'const/colors';

export const StyledViewAllBtn = styled.button`
  width: 286px;
  padding: 0.796875rem 1rem;
  background-color: ${COLORS.PURPS.LEVEL_10};
  color: ${COLORS.PURPS.LEVEL_3};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  font-family: 'halyard-text';
  font-size: 1rem;
  border: 0;
  font-weight: 500;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  outline: none;

  &:hover {
    background-color: ${COLORS.PURPS.LIGHT_TONE_3};
    color: ${COLORS.PURPS.LEVEL_3};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
