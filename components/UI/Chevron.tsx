import React from 'react';
import styled from 'styled-components';
import ChevronDown from 'assets/chevronDown';

export type TChevron = {
  isActive?: boolean | Boolean;
  activeCursor?: boolean;
  width?: string;
  height?: string;
  className?: string;
};

const StyledChevron = styled.div<TChevron>`
  width: ${({ width = '1.25rem' }) => width};
  height: ${({ height = '1.25rem' }) => height};
  display: inline-block;
  position: relative;
  svg {
    transition: transform 0.3s ease;
    transform-origin: center;
  }

  ${({ isActive, activeCursor = true }) => {
    return isActive
      ? `
    svg {
        transform: rotate(0deg) scaleY(-1); 
      }
    cursor ${activeCursor ? `pointer` : `not-allowed`};`
      : 'cursor: pointer;';
  }}
`;

const Chevron = (props: TChevron) => {
  return (
    <StyledChevron {...props}>
      <ChevronDown />
    </StyledChevron>
  );
};

export default Chevron;
