import React from 'react';
import { STAR_FULL, STAR_EMPTY, STAR_HALF } from '../../assets/SvgIcons';
import styled from 'styled-components';

const StyledStar = styled.div`
  ${({ starSize }) => `width: ${starSize}; height: ${starSize};`}
`;

const Star: React.FC<{
  fillValue: number;
  starSize: string;
  fillColor: string;
}> = ({ fillValue, starSize, fillColor }) => {
  let svg = <STAR_FULL fillColor={fillColor} />;
  if (fillValue < 0.25) {
    svg = STAR_EMPTY;
  } else if (fillValue < 0.75) {
    svg = <STAR_HALF fillColor={fillColor} />;
  }
  return <StyledStar starSize={starSize}>{svg}</StyledStar>;
};

export default Star;
