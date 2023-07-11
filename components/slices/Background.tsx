import React from 'react';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';
import { FULL_WIDTH_SLICES } from '../../constants';
import sliceHandler from '../Slices';

const StyledBackground = styled.div`
  padding: 40px 0;
  background: ${({
    // @ts-expect-error TS(2339): Property 'colorProp' does not exist on type 'Pick<... Remove this comment to see the full error message
    colorProp,
  }) => colorProp};
  text-align: ${({
    // @ts-expect-error TS(2339): Property 'textCenter' does not exist on type 'Pick... Remove this comment to see the full error message
    textCenter,
  }) => (textCenter ? 'center' : 'initial')};
  font-family: ${HALYARD.FONT_STACK};
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

const Background = (props: any) => {
  const { slices, sliceProps, color, gridCenter, textCenter } = props;
  const colorMap = {
    'Chalk Grey': COLORS.GRAY.G7,
    'Light Grey': COLORS.GRAY.G8,
  };
  return (
    <StyledBackground
      // @ts-expect-error TS(2769): No overload matches this call.
      colorProp={colorMap[color] || '#fff'}
      gridCenter={gridCenter}
      textCenter={textCenter}
    >
      {slices.map((slice: any, index: number) => (
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
