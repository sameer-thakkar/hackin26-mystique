import React from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';

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
  &::before,
  &::after {
    content: '';
    top: 0.5em;
    position: absolute;
    width: 0.75em;
    height: 0.1em;
    background-color: ${COLORS.GRAY.G2};
    display: inline-block;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }
  &::before {
    left: 0;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  &::after {
    right: 0;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  ${({ isActive, activeCursor = true }) => {
    return isActive
      ? `&::before {
      -webkit-transform: rotate(-45deg);
              transform: rotate(-45deg);
      }
    &::after {
      -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
    }
    cursor ${activeCursor ? `pointer` : `not-allowed`};`
      : 'cursor: pointer;';
  }}
`;

const Chevron = (props: TChevron) => {
  return <StyledChevron {...props}></StyledChevron>;
};

export default Chevron;
