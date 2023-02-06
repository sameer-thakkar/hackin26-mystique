import React from 'react';
import styled from 'styled-components';
import { HALYARD } from 'const/ui-constants';

import sliceHandler from '../Slices';

const StyledListicleSection = styled.div`
  width: 690px;
  margin: 0 auto;
  @media (max-width: 768px) {
    width: auto;
  }
`;

const ListicleGrid = styled.div`
  display: grid;
  grid-template-columns: ${({  
 // @ts-expect-error TS(2339): Property 'listicleType' does not exist on type 'Pi... Remove this comment to see the full error message
 listicleType }) =>
    listicleType === 'small' ? 'repeat(2, 1fr)' : '1fr'};
  grid-row-gap: 24px;
  grid-column-gap: 16px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h2`
  font-family: ${HALYARD.FONT_STACK} !important;
  font-weight: 600 !important;
  font-size: 24px !important;
  line-height: 28px !important;
  margin: 0 0 24px 0 !important;
  ::after {
    content: unset !important;
  }
`;

type ListicleSectionProps = {
  type: string;
  title: string;
  slices: any[];
};

/**
 * A listicle section displaying different types of Listicles.
 *
 * Video Explanation:
 *
 * <div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/f9bfcdc9795f48f584a607d3e3b0eacf" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
 *
 * This is a special kind of slice. To use follow below instructions:
 *
 * You have to first insert a 'Listicle Section Start' slice with the following fields:
 *
 * ### Non-repeatable zone
 * - Section Title
 * - Listicle Type
 *  - 'Large', 'Medium' or 'Small'
 *
 * ### Repeatable zone
 * Nil.
 *
 * After this, keep adding intermediate <a href="https://headout.github.io/mystique/?path=/docs/slices-listicle">Listicle slices</a> and then close the Section with a 'Listicle Section End' slice.
 *
 */

const ListicleSection: React.FC<ListicleSectionProps> = ({
  type,
  title,
  slices,
}) => {
  return (
    <StyledListicleSection>
      <Title>{title}</Title>
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <ListicleGrid listicleType={type}>
        {slices.map((slice, index) => {
          return sliceHandler(slice, { type, index });
        })}
      </ListicleGrid>
    </StyledListicleSection>
  );
};

export default ListicleSection;
