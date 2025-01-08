import React, { useMemo } from 'react';
import styled from 'styled-components';
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

/**
 * Background wrapper does not receive row-gap that is present
 * within the Long-form wrapper.
 *
 * Now that we have moved away from background slice functionality,
 * we will replicate the margin present within the long-form wrapper.
 */
const BackgroundWrapper = styled.div`
  display: grid;
  grid-row-gap: 3.5rem;

  @media (max-width: 768px) {
    grid-row-gap: 3.25rem;
  }
`;

const Background = (props: any) => {
  const { childSlices: slices, sliceProps } = props;

  const components = useMemo(() => {
    return sliceComponents();
  }, []);

  return (
    <BackgroundWrapper data-qa-marker={'background-slice-wrapper'}>
      <SliceZone
        slices={slices}
        components={components}
        context={sliceProps}
        defaultComponent={() => null}
      />
    </BackgroundWrapper>
  );
};

export default Background;
