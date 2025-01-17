import React from 'react';
import styled from 'styled-components';
import StarEmpty from 'assets/starEmpty';
import StarFull from 'assets/starFull';
import StarHalf from 'assets/starHalf';

const StyledStar = styled.div`
  ${({
    // @ts-expect-error TS(2339): Property 'starSize' does not exist on type 'Pick<D... Remove this comment to see the full error message
    starSize,
  }) => `width: ${starSize}; height: ${starSize};`}
`;

const Star: React.FC<
  React.PropsWithChildren<{
    fillValue: number;
    starSize: string;
    fillColor: string;
  }>
> = ({ fillValue, starSize, fillColor }) => {
  let svg = <StarFull fillColor={fillColor} />;
  if (fillValue < 0.25) {
    svg = StarEmpty;
  } else if (fillValue < 0.75) {
    svg = <StarHalf fillColor={fillColor} />;
  }
  // @ts-expect-error TS(2769): No overload matches this call.
  return <StyledStar starSize={starSize}>{svg}</StyledStar>;
};

export default Star;
