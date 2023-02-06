import React from 'react';
import styled from 'styled-components';

import { STAR_FULL, STAR_EMPTY, STAR_HALF } from '../../assets/SvgIcons';

const StyledStar = styled.div`
  ${({  
 // @ts-expect-error TS(2339): Property 'starSize' does not exist on type 'Pick<D... Remove this comment to see the full error message
 starSize }) => `width: ${starSize}; height: ${starSize};`}
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
  // @ts-expect-error TS(2769): No overload matches this call.
  return <StyledStar starSize={starSize}>{svg}</StyledStar>;
};

export default Star;
