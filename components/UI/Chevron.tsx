import React from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { CHEVRON_DOWN } from 'assets/SvgIcons';

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
    -webkit-transform: rotate(45deg) translate(-1px, 0);
    transform: rotate(45deg) translate(-1px, 0);
  }
  &::after {
    right: 0;
    -webkit-transform: rotate(-45deg) translate(1px, 0);
    transform: rotate(-45deg) translate(1px, 0);
  }
  svg {
    transition: transform 0.3s ease;
    transform-origin: center;
  }

  ${({ isActive, activeCursor = true }) => {
    return isActive
      ? `&::before {
      -webkit-transform: rotate(-45deg) translate(-1px, 0);
              transform: rotate(-45deg) translate(-1px, 0);
      }
    &::after {
      -webkit-transform: rotate(45deg) translate(1px, 0);
              transform: rotate(45deg) translate(1px, 0);
    }
    svg {
        transform: rotate(0deg) scaleY(-1); 
      }
    cursor ${activeCursor ? `pointer` : `not-allowed`};`
      : 'cursor: pointer;';
  }}
`;

const Chevron = (props: TChevron) => {
  return <StyledChevron {...props}>{CHEVRON_DOWN}</StyledChevron>;
};

export default Chevron;
