import React from 'react';
import { STAR_FULL_NEW, STAR_EMPTY_NEW, STAR_HALF_NEW } from 'assets/SvgIcons';

const StarRebranded: React.FC<{
  fillValue: number;
  fillColor: string;
}> = ({ fillValue, fillColor }) => {
  let svg = <STAR_FULL_NEW fillColor={fillColor} />;
  if (fillValue < 0.25) {
    svg = <STAR_EMPTY_NEW fillColor={fillColor} />;
  } else if (fillValue < 0.75) {
    svg = <STAR_HALF_NEW fillColor={fillColor} />;
  }
  return svg;
};

export default StarRebranded;
