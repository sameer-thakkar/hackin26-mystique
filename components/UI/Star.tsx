import React from 'react';
import { STAR_FULL, STAR_EMPTY, STAR_HALF } from '../../assets/SvgIcons';
import styled from 'styled-components';

const StyledStar = styled.div`
  ${({ starSize }) => `width: ${starSize}; height: ${starSize};`}
`;

const Star = ({ fillValue, starSize }) => {
  let svg = STAR_FULL;
  if (fillValue < 0.25) {
    svg = STAR_EMPTY;
  } else if (fillValue < 0.75) {
    svg = STAR_HALF;
  }
  return <StyledStar starSize={starSize}>{svg}</StyledStar>;
};

export default Star;
