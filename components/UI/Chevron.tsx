import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants/ui-constants';

const StyledChevron = styled.div`
  width: 1.25em;
  height: 1.25em;
  display: inline-block;
  position: relative;
  margin: 0 1em;
  cursor: pointer;
  &::before,
  &::after {
    content: '';
    top: 0.5em;
    position: absolute;
    width: 0.75em;
    height: 0.1em;
    background-color: ${COLORS.DAVY_GREY};
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
  ${({ isActive }) => {
    return isActive
      ? `&::before {
      -webkit-transform: rotate(-45deg);
              transform: rotate(-45deg);
      }
    &::after {
      -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
    }`
      : '';
  }}
`;

const Chevron = props => {
  return <StyledChevron {...props}></StyledChevron>;
};

export default Chevron;
