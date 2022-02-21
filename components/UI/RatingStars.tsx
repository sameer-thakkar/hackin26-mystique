import React from 'react';
import styled from 'styled-components';
import StarRebranded from 'UI/StarRebranded';
import { COLORS } from 'const/ui-constants';

interface Props {
  averageRating: number;
}

const StyledWrapper = styled.div`
  display: flex;

  svg {
    margin-right: 0.25rem;
  }
`;

const RatingStars: React.FC<Props> = ({ averageRating }) => {
  return (
    <StyledWrapper>
      {Array(Math.ceil(averageRating))
        .fill(0)
        .map((_, index) => (
          <StarRebranded
            key={index}
            fillColor={COLORS.HEADOUT_CANDY}
            fillValue={
              averageRating >= index + 1
                ? 1
                : Math.ceil(averageRating) - averageRating
            }
          />
        ))}
    </StyledWrapper>
  );
};

export default RatingStars;
