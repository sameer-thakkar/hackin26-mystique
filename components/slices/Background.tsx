import React from 'react';
import styled from 'styled-components';
import { COLORS, SOLEIL } from 'const/ui-constants';

import sliceHandler from '../Slices';
import { FULL_WIDTH_SLICES } from '../../constants';

const StyledBackground = styled.div`
  padding: 40px 0;
  background: ${({ colorProp }) => colorProp};
  text-align: ${({ textCenter }) => (textCenter ? 'center' : 'initial')};
  font-family: ${SOLEIL.FONT_STACK};
`;

/**
 *`Background Section` allows you fill a slice area using color of choice from standard list of colors.
 *
 * This is usefull when you need to create a clear distinction between text section or other elements.
 *
 * To add a `Background Section` Simply wrap your desired slice within a `Background Start` and `Background End`.
 *
 * All Elements within will now be filled with the color you select inside the `Background Start` options.
 *
 *
 * > Structure
 *
 *```html
 *<background_start color="SELECTION">
 *  <slice_a />
 *  <slice_b />
 *  <slice_a />
 *<background_end>
 *```
 *
 */

const Background = (props) => {
  const { slices, sliceProps, color, gridCenter, textCenter } = props;
  const colorMap = {
    'Chalk Grey': COLORS.CHALK,
    'Light Grey': COLORS.LIGHTER_WHITE,
  };
  return (
    <StyledBackground
      colorProp={colorMap[color] || '#fff'}
      gridCenter={gridCenter}
      textCenter={textCenter}
    >
      {slices.map((slice, index) => (
        <div
          key={index}
          className={`${
            !FULL_WIDTH_SLICES.includes(slice.slice_type) ? 'slice-wrapper' : ''
          } slice-block ${slice.slice_type}`}
        >
          {sliceHandler(slice, sliceProps)}
        </div>
      ))}
    </StyledBackground>
  );
};

export default Background;
