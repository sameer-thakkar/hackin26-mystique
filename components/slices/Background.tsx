import React, { useMemo } from 'react';
import { SliceZone } from '@prismicio/react';
import { sliceComponents } from './sliceManager';

/**
 * Legacy settings:
 * `Background Section` allows you to fill a slice area using color of choice from standard list of colors.
 *  This is useful when you need to create a clear distinction between text section or other elements.
 *  To add a `Background Section` Simply wrap your desired slice within a `Background Start` and `Background End`.
 *  All Elements within will now be filled with the color you select inside the `Background Start` options.
 *
 *  > Structure
 *  ```html
 *    <background_start color="SELECTION">
 *      <slice_a />
 *      <slice_b />
 *      <slice_a />
 *    </background_end>
 *  ```
 *
 * NOTE: Update December 2024
 *
 * As part of migration from prismic to payload, we are not moving background slice.
 * To ensure Visual difference accuracy, the background slice functionality is removed and is replaced
 * with a regular `div` element.
 */

const Background = (props: any) => {
  const { childSlices: slices, sliceProps } = props;

  const components = useMemo(() => {
    return sliceComponents();
  }, []);

  return (
    <div>
      <SliceZone
        slices={slices}
        components={components}
        context={sliceProps}
        defaultComponent={() => null}
      />
    </div>
  );
};

export default Background;
